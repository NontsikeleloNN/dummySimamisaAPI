const partneringController = require('../controllers/partneringController')

const router = require('express').Router()

router.post('/',partneringController.sendReq)// sending a partnering request (... /from?=x&to?=y)
router.get('/',partneringController.getPartners) //get my partners ( orphanages/partnering/id?=x)
router.post('/offers/',partneringController.sendOfferToAll) // (orphanages/partnering/offers/id?=x)
router.post('/offers/',partneringController.sendOfferToOne)
router.put('/',partneringController.acceptRequest) // (/?from=x&to=y)
router.get('/offers/',partneringController.getMyOffers) //pffers made to me .. /offers/?id=x
router.get('/requests/', partneringController.getRequests) // .. /requests/?id=x

module.exports = router