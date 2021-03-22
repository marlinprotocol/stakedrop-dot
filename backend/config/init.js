const {
  params,
  whitelistedValidators,
  registeredAddresses,
} = require("../models");
const { polkadot } = require("../constants");
const chainStartEra = parseInt(process.env.CHAIN_START_ERA);
const chainStartBlock = parseInt(process.env.CHAIN_START_BLOCK);

async function init() {
  let latestEra = await params.findOne({ param: polkadot.latestEra });
  if (!latestEra) {
    latestEra = new params({
      param: polkadot.latestEra,
      value: chainStartEra,
    });
    await latestEra.save();
  }

  let confirmedEra = await params.findOne({ param: polkadot.lastConfirmedEra });
  if (!confirmedEra) {
    confirmedEra = new params({
      param: polkadot.lastConfirmedEra,
      value: chainStartEra,
    });
    await confirmedEra.save();
  }

  await check(polkadot.lastConfirmedEraForValidators, chainStartEra);
  await check(polkadot.lastConfirmedEraForDelegators, chainStartEra);
  await check(polkadot.lastConfirmedBlock, chainStartBlock);
  await check(polkadot.latestBlock, chainStartBlock);

  await check(polkadot.feederEra, chainStartEra);
  await check(polkadot.totalStakeFeeder, chainStartEra);
  await check(polkadot.validatorStakeFeeder, chainStartEra);
  await check(polkadot.delegatorStakeFeeder, chainStartEra);
  await check(polkadot.freezeEra, chainStartEra);

  if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "prod") {
    await addValidator([
      "16P6nQ6oigiaVm3GwvSLsNgDhmVpy23YRU5TiRPeQGShjRsi",
      "1bAVKRsNUbq1Qmvj7Cemkncjo17WgyWAusCFZQdUfeHSTYj",
      "15dEbKrzyw8Hwb7KkZHYKgCaPQGxnMgWm2EXb1zh6DmRKX22",
      "16P6nQ6oigiaVm3GwvSLsNgDhmVpy23YRU5TiRPeQGShjRsi",
      "1bAVKRsNUbq1Qmvj7Cemkncjo17WgyWAusCFZQdUfeHSTYj",
      "15dEbKrzyw8Hwb7KkZHYKgCaPQGxnMgWm2EXb1zh6DmRKX22",
      "14Uu59k5VLBz3zLMaEe3LBcqRLfKw2VJu2D3krxTssREjDJc",
      "1gpCRov55rqmNaoEVRNAUCCYVzSGghitLNabng8UHVGwv1g",
      "15XPnFSn3CqjkCdNzdmgzwFadU9txoGizjYew3HmsXoE3J4Z",
      "149BcHWnp6cMNSgPUwLjhSVrMZBs4pqVQyS95uz7RP1ztPtB",
      "13itjxnLHTbTDF8wM4gvZihjL4Gx33kYFfCXApF6gaZTBozH",
      "152rhiuVCzb2ehkTnga29tWwe8dRFKS5ERBvzSKS6ndtc7vt",
      "1qGNHjLAmMiAaD2cfoQhh5ejtT54Lj4aERom7tphVFuJ2Eo",
      "1qGNHjLAmMiAaD2cfoQhh5ejtT54Lj4aERom7tphVFuJ2Eo",
      "14cxMDpBNLsNEXWyCzked3zghzaYWXwoqGT4h12GqQXdVhmn",
      "15AcyKihrmGs9RD4AHUwRvv6LkhbeDyGH3GVADp1Biv4bfFv",
      "12bUkY5nrGyoXqBpxKDf88z5VQWzaUK83PCgyHtJ1UN1ujjU",
      "14j7YcVqpfiZwbrPuwMfcKWuY176cKN1SMHVSZvT7yrfhbnt",
      "12DsYUto9AcKA4kRz1yLcGh13CTLe7LbUjDkMS8ZY8rCK4rn",
      "16aThbzrsb2ohiLXJLqN8jLST6JgUPRi3BqyHxUW4yVHBQ44",
      "16A1zLQ3KjMnxch1NAU44hoijFK3fHUjqb11bVgcHCfoj9z3",
      "14j3azi9gKGx2de7ADL3dkzZXFzTTUy1t3RND21PymHRXRp6",
      "14MDvXHcSfZXacZR3nvbS4XYgpWi2dY65BnthsUnMZU6R1kH",
      "14g7XsFWsMpsPNkwQNhdHfsqKRehdRbpPLaGVTEhBe4Pt3Eu",
      "15BQUqtqhmqJPyvvEH5GYyWffXWKuAgoSUHuG1UeNdb8oDNT",
      "15tchmYRA5e1RQZs6PE2Xfq9oxfv86JQBi2yz372sXjovrd7",
      "13ofm5Yg4FmACJ3torjifcw4z8yPKs4eNZFXXsBkHeJz3qHm",
      "12KoQFveGCXS5m1uANBZNo22j86GVmaD8i1N6t4UxVaPxKuU",
      "16Zgx3vsge6VdLW8WYk6hCX1EqgRk61vnJuqZmoYMdwmX2iR",
      "16ALLQukR3zfhAC9Uzb6HPYHvQWH6hcricDnskc4XL8kvePF",
      "15QbBVsKoTnshpY7tvntziYYSTD2FyUR15xPiMdpkpJDUygh",
      "12gkhA8JEz8ywmVj1tsVafSp9C4saKzSofgMwBJcmFJAGUVX",
      "12wtfs4UfodYT1Y6y8NQsQaduLSJbhz7oaNt1F6gTLFHD1y5",
      "14Q74NU7dG4uxiHTSCSZii5T1Y368cm7BNVNeRWmEuoDUGXQ",
      "14ghKTz5mjZPgGYvgVC9VnFw1HYZmmsnYvSSHFgFTJfMvwQS",
      "13T9UGfntid52aHuaxX1j6uh3zTYzMPMG1Des9Cmvf7K4xfq",
      "14xKzzU1ZYDnzFj7FgdtDAYSMJNARjDc2gNw4XAFDgr4uXgp",
      "1vEVWfqoLErB6MhhtDijrnmnHqjhrrFA5GzXGNL2HwESQ5r",
      "1EmFhcsr7xt4HiMc8KZz6W6QcjYSFukKGKeDZeBjSmjjpNM",
      "1HZMocNpdw6VYS1aKyrdu1V7kHpbdCvhL8VKayvzVzqTf6H",
      "13asdY4e7sWdJ4hbGW9n2rkNro1mx5YKB6WBCC9gvqKmLvNH",
      "126y5f2ePBHvYorTEGUYys53tzvno6RNVwpLStJMbVukP9dJ",
      "167UVcopJ1ZEP72wUyK2dZiTF5sz8VRXVD39eAKkRS12zYJN",
      "12xteUu27nj8zxMJnQyaZyrChrN9USPh3vR1w5GnB7Ur2mUR",
      "12zuGuVCwx4cQuSSwsFm66Hfb7iBreNGZAZrv5XNrC2NyJdC",
      "1xnFYogB642iL4mbqiUrkKV1xK562WMnG9z3e3C5gur4snc",
      "12NdCS1BNxgiedktuiA9LDWT4aUha1BL86io1bJTS6FXM8nb",
      "1Wo6qcrh7wxc1kQY5nfixFuCAFuzkgiwau64SmrPXBE7vVf",
      "1bwZeqrfVQU69WgDg4exZoLp7abmfgP7btcMnfijCyX9zvT",
      "1UBzeeDPZWQxNzobGTi1HLHFQjN8vBcgnbtEYSDzfZuxFPr",
      "11uMPbeaEDJhUxzU4ZfWW9VQEsryP9XqFcNRfPdYda6aFWJ",
      "12ud6X3HTfWmV6rYZxiFo6f6QEDc1FF74k91vF76AmCDMT4j",
      "12Z3Bhjn42TPXy5re2CiYz1fqMd21i2XyBLmbekbjLXrqVBV",
      "12CN2fCWC43fPXMLia1PCTsvE491KZ1KKzG2ExvACPY6puV9",
      "12YP2b7L7gcHabZqE7vJMyF9eSZA9W68gnvb8BzTYx4MUxRo",
      "12GsUt6XbVMHvKt9NZNXBcXFvNCyTUiNhKpVnAjnLBYkZSj1",
      "12WafjZWsgVZGvFzZ7EXYFukSpLEZV3cieRYmtd6xZYGbpXr",
      "12EcabFybCY2iaurUryCRYfHbDUpj2AtA2JNhwCfcdAE55ov",
      "12ws45JuLDFtcyJVXcNbzijvzFSibrwSiRk1UJKVdggPcDcK",
      "13giQQe5CS4AAjkz1roun8NYUmZAQ2KYp32qTnJHLTcw4VxW",
      "13uW7auWPX9WAtqwkBx7yagb78PLcv8FAcPZEVCovbXoNJK4",
      "13eJW8EEepfprmeezKHn9gbgqHAk9izHyUxReA7RjDuuSTyC",
      "13Ei9Xuqwu971JiBAkZx92XgBzX1wpuRnwi5qx76ZueAnGko",
      "13XwbRe9QTAtWADatMiCNhjq7CpRjRGXLvFuRrzWVAzoz8mc",
      "13ovfMxkqtTV5P87aofiyQ3mkzkbm7Uc2BdB36TcoiqtkLk4",
      "13Qe2MpQeYCQhFYWimxxXM6epyMy9zDRd7cguxUjMziLKkPL",
      "14QBQABMSFBsT3pDTaEQdshq7ZLmhzKiae2weZH45pw5ErYu",
      "14AkAFBzukRhAFh1wyko1ZoNWnUyq7bY1XbjeTeCHimCzPU1",
      "14Y626iStBUWcNtnmH97163BBJJ2f7jc1piGMZwEQfK3t8zw",
      "14QShJ8R9gtRd9DHTpWL56etZQLT15JeLNEWHQsQMN3hDtHE",
      "14SRtmkZPGzaV1bKivd7T6xw15YRW53gjE5F2LVbiwChqKGx",
      "14aN2MKS7sMrof8ZPbUKs7C8CpuS939ymFf1BKgEGHmHd5jw",
      "14GQkqk2rGYp1cfAPJY9EQWnXk6EHHYjDx44Rx3NAvDpiNau",
      "15qomv8YFTpHrbiJKicP4oXfxRDyG4XEHZH7jdfJScnw2xnV",
      "15oKi7HoBQbwwdQc47k71q4sJJWnu5opn1pqoGx4NAEYZSHs",
      "15aPXmYSpCxdVEMAdyoED2ZGLXKMr7naU7DzfB2ayBxn6Ncn",
      "15Q4hMef4AGNKwgK5hd7k6zWvyaK8DhfhpaCHDGxdS7buxDf",
      "15MeTQLVSPPXhLHqL7ujSiqDVmkJpf4rd97zDX9Dj1NkqkWP",
      "16DKyH4fggEXeGwCytqM19e9NFGkgR2neZPDJ5ta8BKpPbPK",
      "16Sud9b5uUfUi1HXdfwb3drbYBZBLPVvdKuZhwxz2n7HR12M",
      "16pYErtQ2n77cQjtZpKzvpqh1w1iDfdLHn65YYsX74tVbkN",
      "121gZtuuG6sq3BZp1UKg8oRLRZvp89SAYSxXypwDJjaSRJR5",
      "121ZiNk5DKVKUuYQtuNcHC25AD2K8bSNaaFn7qSa4JrSwYBR",
      "129TM37DNpyJqtRYYimSMp8aQZ8QW7Jg3b4qtSrRqjgAChQf",
      "134Bw4gHcAaHBYx6JVK91b1CeC9yWseVdZqyttpaN5zBHn43",
      "135q2jwLPAtsKW6vPLfBqh3Cxmi5Sj7mNL93Cx7AsYD2XRUh",
      "145Vw57NN3Y4tqFNidLTmkhaMLD4HPoRtU91vioXrKcTcirS",
      "158WyuVKFJZaTx36fNdXMg8GTXiGT42dCZA8XsEfYfZDrFyQ",
      "1293x8Max5nQW6J8ubgKWuEFMViQBAxb7CxfFakpApoRXYUC",
      "1342iFZNrBfCP9VWxqt5p39LiHp2ynyq85Ww9K7R8w6BURps",
      "1737bipUqNUHYjUB5HCezyYqto5ZjFiMSXNAX8fWktnD5AS",
      "14kh8jr87q7vb5N7JrgAQj18Cz5vBGGFPYndLjRyCwPAnQTf",
      "14QBQABMSFBsT3pDTaEQdshq7ZLmhzKiae2weZH45pw5ErYu",
      "16DKyH4fggEXeGwCytqM19e9NFGkgR2neZPDJ5ta8BKpPbPK",
      "121PfffxyeLU9BQ1CapyLH9Sio5n3CChk5LtWq23Ermu4SJK",
      "15db1bgcvzyNT9r8TD8JDqoCAsCHauGukbXz1CQU5sXeskVJ",
      "15Q9EzWyyMYmZHstZo78zi4zbX9PdqJ1tgMBYgYjRYDw2LEd",
      "13u493WVZSf2yL2ZPARHP9gVVzrdqX9z7cDFwXAdcUmkWW6Z",
      "15Uh3L6SjrZ8gxASVUKQXmPWj7JPJWkJYaJEvBpJKfsxaECN",
      "14fyJYFk6YDaLSso5r98Ho5CpxE8rjUCMRqSX8Tptax29kbC",
      "1588akqMfBQy5uZ4Bea4hRAwe5r7KjJX9C5Y7wD7dPCE1gHd",
      "16fznKHPzUUt2QkxB7v9JiPCz7N9j4cBBCjvRKYzf1Gksh8d",
      "12rYYvbwyihC3AcPoAsaJjVyETxMRuDj8bhdb9Mo3DwUU2uo",
      "12xedMA9ZJFe6Ui5VDYML3PsCde2LbhUzEYEPyCgFRcJvfRB",
      "14dXwAMCnL1tqLM3XWy9Uh5BwxsMg2mX48yyoEsMB9DJfhmY",
      "1CaADFobtnCfPfEpn2HxbwD7TALqy3ohiJuSc9dSh5iSo5K",
      "16Agvt3s9tXicwiccTEynQX4q813PZw9ozTydvVwRgWsfbC6",
      "153acrz21joSN37VuCJUpZdhyTJivo81rJVxNTrnY3GeVWeU",
      "1pKc7abu9Cm9YqoMeUFqdMBUxKJVuVUFPRcjpxcyKvjkx5m",
      "14oTqhVovqnamxu2SiP79WfJMvhRRwiF4d2Hjs25d4SDQNjJ",
      "15ho6JmfrKVviPKxVuwwV4nSe1BSjDP1rCBFsubBihP96wdZ",
      "1341kcAXqyA5ZJHBdPoLeHsDtmqLBZ2qm5Hu7e9tDR9Jv5RM",
      "13gJhYAWEuZomHsp7nBushCwqizG5ZPXoNZ2Z9hP5dynmcnJ",
      "14zCfcqjbNpc2gbiNwy4B7RiSfJzqpyznVGnZ1g6QCCQsY5F",
      "143xeV45MsSeUGFpCns1ACgaUvCeouSJ4WDoppio9qNUNr5S",
      "15a9ScnYeVfQGL9HQtTn3nkUY1DTB8LzEX391yZvFRzJZ9V7",
      "13BeUcLu7hzSTaoKpEtpdqiXKZz6yVfT9exKH6JuTW8RQQvJ",
      "1RJP5i7zuyBLtgGTMCD9oF8zQMTQvfc4zpKNsVxfvTKdHmr",
      "12dvyqCFhVubTDqMdojyjhkxVUMaYVXWLv8uZW1NomUunPmN",
      "1RG5T6zGY4XovW75mTgpH6Bx7Y6uwwMmPToMCJSdMwdm4EW",
      "1LMtHkfrADk7awSEFC45nyDKWxPu9cK796vtrf7Fu3NZQmB",
    ]);

    await removeValidator([
      "14ibH1yy3Z885hJ7NesyPnfqQTi3e2zX8Pzy3orUzW1rrGy3",
      "1n3ZhCMUNmSKLQBLxGthHLkQz43hJXd6x2QAJ414iS9hqRZ",
      "15TAQtkYsif1uB3G8n47Qyw2wpeLK5pcybjdczMSa8qV1FLD",
      "15ALL6i5WYPcYPVfnKRWgyn9UMR41M6KNG5Z8oegTkL1JF5k",
      "13dsF8U5e3oKF75R8HoQFmSz1UaGYt4m1fy6bswF9kdKV6hU",
    ]);
  }

  if (process.env.NODE_ENV == "dev") {
    await addAddresses([
      {
        address: "14GvFJE8hqLyQFXkiEvGkTVtbTRGMU4wRC6jNHHKXykPnLA1",
        ethereumAddress: "0xFC57cBd6d372d25678ecFDC50f95cA6759b3162b"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "16HvKyV9B61hsop3ZY6pWYeV537S29kd9pb9FMrPzx49ym5X",
        ethereumAddress: "0x025D3b4caCcc57D8D2485130AEE349F8C60Ab738"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "14z4r6EJMkCeQyxrAuHfdbVJRESA3veXDcTxcViHuMj5dEEA",
        ethereumAddress: "0xdeFF2Cd841Bd47592760cE068a113b8E594F8553"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "13mbLCRUQyFQWEHniQQLZhkpRbJGw4Dkttec9fUuaKkR95X5",
        ethereumAddress: "0x60fEB537C1412d1C5ea5462a0984F058c347BC13"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "15oqs89aVy6bgk7PwyULibbxzyowGBjPxuQAduxeHor3pn9Y",
        ethereumAddress: "0xd2D0cD3E49Ee6724d1d403E3D4a9ee7AA8aD7627"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "14oUkrAXTfDpYtwuhAt1twZXCQ5VFfqE3dyXXY8WTFyexnez",
        ethereumAddress: "0x46D07d37704B15388d97Ca5F95E64F6d9801f9BF"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "1nfsMtBMV2b5CWr1PGgRhsPp7eg5wog6Aw7QF6rueWASqMU",
        ethereumAddress: "0x90C1AB208Bc7C22a4306BC70899622934BF0F513"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "124abMcBcToayqnaC3XhZZTmEwXR82B7PbwxXw1PuriRLXff",
        ethereumAddress: "0xFB22c0B729BF5F56aD904f71307FC247A82C2AF5"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "14GPSy2ugNGEV2ypB6X6h8yZ8sRiLEsyBHj6SemJPg36Q4P6",
        ethereumAddress: "0x15A9Cdbf563a613d4A07c890aC7A404a17157236"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "138J63FK8DcZMRgfBXmvpMXFVztwwT3MA87pWrTW8YDLjLKZ",
        ethereumAddress: "0x8da03780fcAF72e490c17e4cab8ad63195bE2084"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "15Dk12SYAncNj5vhjszjGetWhPAXrcShnC4tnh9Y3rbgUpis",
        ethereumAddress: "0x2a63a4188082270f172Ff8988fBaB252e4201BEe"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "15Mo7G4HY7c9RvR4ooKS975SQxj8f2Htxxw7VT99BHg1A6ug",
        ethereumAddress: "0x811e09Fd507730E9D42424d828908f714C5A607C"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "121fFdzRKVJEPAcK2jqY3iJFwuue1MsUCXbEgdqiV9BsBDsS",
        ethereumAddress: "0xF1A1f124BA6914087f54825b4bCF1907B61d718E"
          .toLowerCase()
          .split("x")[1],
      },
    ]);
  }

  return "Init Complete";
}

module.exports = init;

async function check(param, value) {
  let _param = await params.findOne({ param });
  if (!_param) {
    await new params({ param, value }).save();
  }
  return;
}

async function addAddresses(registrations) {
  for (let index = 0; index < registrations.length; index++) {
    const element = registrations[index];
    let { address, ethereumAddress } = element;
    await addAddress(address, ethereumAddress);
  }
  return;
}

async function addAddress(address, ethereumAddress) {
  let _data = await registeredAddresses.findOne({ address });
  if (!_data) {
    await new registeredAddresses({ address, ethereumAddress }).save();
  }
  return;
}

async function addValidator(validators) {
  for (let index = 0; index < validators.length; index++) {
    const element = validators[index];
    await addWhiteListedValidator(element);
  }
}

async function removeValidator(validators) {
  for (let index = 0; index < validators.length; index++) {
    const element = validators[index];
    await removeWhiteListedValidator(element);
  }
}

async function addWhiteListedValidator(validatorAddress) {
  let _validator = await whitelistedValidators.findOne({ validatorAddress });
  if (!_validator) {
    await new whitelistedValidators({ validatorAddress }).save();
  }
  return;
}

async function removeWhiteListedValidator(validatorAddress) {
  await whitelistedValidators.deleteOne({ validatorAddress });
  return;
}
