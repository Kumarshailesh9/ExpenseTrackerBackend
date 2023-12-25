const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");

// exports.getExpense = async (req, res) => {
//     const expense = await Expense.findAll({where : {userId: req.user.id}});

//     res.json(expense);
// };


//const ITEM_PER_PAGE = 10;
exports.getExpense = async (req, res) => {
    const page = +req.query.page|| 1;
    const ITEM_PER_PAGE = +req.query.pageSize || 5;
    console.log(ITEM_PER_PAGE);
    let totalItem;
    Expense.count()
    .then((total) => {
        totalItem = total;
        return Expense.findAll({
            offset: (page-1)*ITEM_PER_PAGE,
            limit: ITEM_PER_PAGE
        })

    .then((expenses) => {
        res.json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: ITEM_PER_PAGE*page < totalItem,
            nextPage: page+1,
            hasPreviosPage: page>1,
            previosPage: page-1,
            lastPage: Math.ceil(totalItem/ITEM_PER_PAGE)
        })
        
    })
    .catch(err => console.log(err));
    })
}


exports.postExpense = async (req, res) => {
    const  t = await sequelize.transaction(); 
    try {
        
        const { price, des, category } = req.body;

        const expense = await req.user.createExpense({
            price,
            des,
            category,
        }, {transaction : t});

        const totalExpense = Number(req.user.totalExpense) + Number(price);
        await User.update({ totalExpense }, { where: { id: req.user.id }, transaction : t} );
        await t.commit();

        res.status(200).json({ success: true, expense });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};



exports.deleteExpense = async (req, res) => {
    const expenseId = req.params.id;
    const deletedExpense = await Expense.findOne({where : { id : expenseId}});
    const t = await sequelize.transaction();
    try{
       
        if(expenseId === undefined || expenseId.length === 0){
            return res.status(400).json({success : false , massage :'Expense not found'})
        }
    
        await Expense.destroy({ where: { id : expenseId , userId:  req.user.id  }, transaction : t});

        const totalExpense = Number(req.user.totalExpense) - Number(deletedExpense.price);

        await User.update({totalExpense}, { where : { id : req.user.id}, transaction: t});

        await t.commit();

        res.status(200).json({messase: 'Expense deleted Successfully!'});
    }
    catch(err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({message : 'Internal Server Error'});
    }

}