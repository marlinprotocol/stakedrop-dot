const { params } = require("../../models");
const { polkadot } = require("../../adapter");
const { polkadot: polkadotConstants } = require("../../constants");

async function saveValidators() {
  while (true) {
    try {
      let testParams = await params.find({
        param: {
          $in: [
            polkadotConstants.latestEra,
            polkadotConstants.lastConfirmedEraForValidators,
          ],
        },
      });
      let latestEra = testParams.filter(function (obj) {
        return obj.param == polkadotConstants.latestEra;
      })[0];
      let confirmedEra = testParams.filter(function (obj) {
        return obj.param == polkadotConstants.lastConfirmedEraForValidators;
      })[0];
      // print(testParams);
      if (confirmedEra.value > latestEra.value) {
        await induceDelay(10000);
      } else {
        let stakers = await polkadotApi.query.staking.erasStakers.entries(
          confirmedEra.value
        );
        if (stakers.length == 0) {
          console.log("No stakes in this era");
          await polkadot.updateValidatorConfirmedEra(confirmedEra.value + 1);
        } else {
          // print(stakers);
          for (let index = 0; index < stakers.length; index++) {
            const element = stakers[index];
            let [key, stake] = element;
            let _temp = key.args.map((k) => k.toJSON());
            let eraNumber = _temp[0];
            let validator = _temp[1];
            let isValidatorWhiteListed = true;
            if (
              process.env.ONLY_WHITE_LISTED_VALIDATORS &&
              process.env.ONLY_WHITE_LISTED_VALIDATORS.toUpperCase() == "TRUE"
            ) {
              let isWhiteListed = await polkadot.isValidatorWhiteListed(
                validator
              );
              if (!isWhiteListed) {
                console.log(`Validator: ${validator} is not whitelisted`);
                isValidatorWhiteListed = false;
              }
            }
            let allStakes = stake.toJSON();
            let ownStake = parseInt(allStakes.own);
            let totalStake = parseInt(allStakes.total);
            await polkadot.saveValidator(
              validator,
              eraNumber,
              ownStake,
              totalStake,
              { isValidatorWhiteListed }
            );
            // print({ eraNumber, validator });
            // throw new Error("Testing Error");
            for (let j = 0; j < allStakes.others.length; j++) {
              const element = allStakes.others[j];
              if (j % 100 == 0 || j == allStakes.others.length - 1) {
                console.log(
                  `Adding nominators ${j}/${allStakes.others.length} nominators in ${index}/${stakers.length} for era ${confirmedEra.value}`
                );
              }
              let isRegisteredAddress = true;
              if (
                process.env.ONLY_REGISTERED_ADDRESSES &&
                process.env.ONLY_REGISTERED_ADDRESSES.toUpperCase() == "TRUE"
              ) {
                let isRegistered = await polkadot.isRegisteredAddress(
                  element.who
                );
                if (!isRegistered) {
                  console.log(`Delegator: ${element.who} is not registered`);
                  isRegisteredAddress = false;
                }
              }
              await polkadot.saveDelegator(
                element.who,
                confirmedEra.value,
                parseInt(element.value),
                totalStake,
                validator,
                { isRegisteredAddress, isValidatorWhiteListed }
              );
            }
          }
          await polkadot.updateValidatorConfirmedEra(confirmedEra.value + 1);
          await induceDelay(5000);
        }
      }
    } catch (error) {
      console.log(error);
      await induceDelay(60000);
    }
  }
}

module.exports = saveValidators;

function induceDelay(ts) {
  let delay = ts || 3000;
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve();
    }, delay);
  });
}

function print(data) {
  console.log(JSON.stringify(data, null, 4));
}
