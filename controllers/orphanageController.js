//const { OrphanageManager } = require('../models/');
const db = require('../models/')
const bcrypt = require('bcryptjs');
const Orphanage = db.Orphanage
const regUser = db.RegisteredUser;
const OrphanageManager = db.OrphanageManager
const Notification = db.Notification


console.log("just before entering ")

//Orphanage.sync() //what does this do?

//search orphanage by name
const getAllOrphanages = async(req,res) =>{
    let orphs;
    try{
        orphs = await Orphanage.findAll({})
        
        console.log(orphs)
    } catch(error) {
    res.status(500).json({
        errorMessage: error.message
    })
  }

  res.status(200).json(orphs)

}


const getOrphanage = async (req,res) => {
    try {
        
        let id = req.query.id
        let orph = await Orphanage.findOne({where: {id: id}})
        res.status(200).send(orph)

    } catch (error) {
        res.status(500).json({
            errorMessage : error.message
        })
    }
}

const regOrphanage = async (req,res) => {
    try {
        

        let newOrphanage = {
       
            DateReg : req.body.Date,
            OrphanageName : req.body.OrphanageName,
            OrphanageDescription : req.body.OrphanageDescription,
            OrphanageImage : req.body.OrphanageImage,
            DefaultChildPassword: req.body.OrphanagePassword,
            Children : req.body.Children
        }
        
        const savedOrphanage = await Orphanage.create(newOrphanage)
            if(!savedOrphanage) return res.status(400).send('could not create orphanage')
            res.status(200).json(savedOrphanage)

    } catch (error) {
        
        console.log(error)
        res.status(500).json({
            errorMessage: error.message
        })

    }
    
}

const getAllNotifications = async (req,res) => {
    try {
        
        var id = req.query.orphanageID
        var notes = await Notification.findAll({where : { orphanageID : id}})
    
        res.stats(200).json(notes)
    } catch (error) {
        
        console.log(error)
        res.status(500).json({
            errorMessage: error.message
        })
    
    }
    }

const regManager = async (req,res) => {
//update userole to M
   try {
    
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(req.body.UserPassword,salt)
    let newUser = ({
        FirstName: req.body.FirstName,
        Surname: req.body.Surname,
        Email: req.body.Email,
        Phonenumber: req.body.Phonenumber,
        Status: 'Manager',
        UserRole : 'R',
        isFlagged: false,
        UserPassword: hashed,
        UserAddress: req.body.UserAddress,
        DOB : req.body.DOB,
        isDonor: false,
        isSponsor: false,
        Gender : req.body.Gender,
        orphanageID : req.body.orphanageID
    })
    
        const savedUser = await regUser.create(newUser);
        
    console.log(newUser.orphanageID + 'here is it')

        let newOrphanageManager = ({
            registeredUserID : await savedUser.ID,
            orphanageID : req.body.orphanageID
        })
        console.log( await savedUser.orphanageID)
        savedUser.UserRole = 'M'
        await savedUser.save()
        const savedMan = await OrphanageManager.create(newOrphanageManager)

        res.status(200).json(savedMan)  

   } catch (error) {
    console.log(error)
    res.status(500).json({
        errorMessage: error.message
    })
   }

   const updateOrph = async(req,res) =>{
    try {
        
        let id = req.body.id;
        // I think I should just receive the changes that I want to and update them accordingly
    
        let orph = await Orphanage.update(req.body,{where: {ID : id}})
            if(!orph) return res.status(400).json('could not update orphanage: '+ id);
    
        res.status(200).json('updated')

    } catch (error) {
        res.status(500).json({
            errorMessage : error.message
        })
    }
}

}


module.exports = {
    getAllOrphanages,
    getOrphanage,
    regOrphanage,
    regManager,
    getAllNotifications ,// add to routes
    updateOrph
}