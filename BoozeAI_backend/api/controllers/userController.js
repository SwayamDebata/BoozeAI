const asyncHandler = require("express-async-handler");
const Users = require("../../models/userModel")

//@desc Get all users
//@route GET /api/users
//@access public
const getUsers = asyncHandler(async(req, res)=>{
    const users = await Users.find();
    res.status(200).json(users);
});

//@desc Get a user
//@route GET /api/user/:id
//@access public
const getUser = asyncHandler(async(req, res)=>{
    const user =  await Users.findById(req.params.id);
    if(!user){
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json(user);
});

//@desc Create a User
//@route POST /api/users
//@access public
const createUser = asyncHandler(async(req, res)=>{
    console.log("The request body is:",req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(404);
        throw new Error('All fields are mandatory');
    }
    const users = await Users.create({
        name,
        email,
        phone,
    })
    res.status(201).json(users);
});

//@desc Update a User
//@route PUT /api/users/:id
//@access public
const updateUser = asyncHandler(async (req, res) => {
    const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json(user);
});


//@desc Delete a User
//@route DELETE /api/users/:id
//@access public
const deleteUser = asyncHandler(async(req, res)=>{
    const user =  await Users.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    await Users.findByIdAndDelete(req.params.id);
    res.status(200).json(user);
});

module.exports = {getUsers, getUser, createUser, updateUser, deleteUser};