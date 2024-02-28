const expressAsyncHandler = require("express-async-handler");
const User = require('../models/userModels')
const generateToken = require('../config/generateToken')

const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the field")
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // creating a new user
    const user = User.create({
        name, email, password, pic
    })


    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("Failed to create the User")
    }
})

const authuser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    }
})

//  /api/user?search=piyush
// two ways to send data to backend -> use post request and use query params

const allUsers = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    }
        : {};       //simple if-else using ternary


    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);

});


module.exports = { registerUser, authuser, allUsers } 