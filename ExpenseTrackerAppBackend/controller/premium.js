

const Sequelize = require("sequelize");
const Download = require("../models/download");
const User = require("../models/user");
const { uploadToS3 } = require("../services/s3services");




exports.downloadExpenses = async (req, res) => {
    const expenses = await req.user.getExpenses();

    const stringifyExpense = JSON.stringify(expenses);
    const id = req.user.id;

    try {
        const filename = `Expense ${id}/${new Date()}.txt`;
        const fileURL = await uploadToS3(stringifyExpense, filename);
        Download.create({ fileURL , userId: id });
        
        res.status(200).json({fileURL, success: true});
    }
    catch(err)  {
        console.log(err);
        res.status(500).json({fileURL : '', success: false})
    }
    
}


//const { Op } = require('sequelize');

exports.timesDownload = async (req, res) => {
  try {
    const { desiredDate } = req.body;

    const numOfDownloaded = await Download.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.between]: [
            new Date(`${desiredDate}T00:00:00.000Z`),
            new Date(`${desiredDate}T23:59:59.999Z`),
          ],
        },
      },
    });

    console.log(numOfDownloaded);
    return res.status(200).json(numOfDownloaded);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server problem' });
  }
};





exports.getPremiums = async (req, res) => {
    try {
        const users = await User.findAll({
            order: [['totalExpense', 'DESC']]
        });

        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

