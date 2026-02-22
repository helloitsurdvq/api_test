const express = require('express');
const traineeController = require("../controllers/traineeController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');
const router = express.Router();

router.use(rateLimitMiddleware);

router.get("/", traineeController.getAllTrainees);
// router.get("/:id", authMiddleware, traineeController.getOneTrainee);
router.get("/:id", traineeController.getOneTrainee);
// router.post("/", authMiddleware, roleMiddleware, traineeController.saveTrainee);
router.post("/", traineeController.saveTrainee);
// router.put("/:id", authMiddleware, roleMiddleware, traineeController.updateTrainee);
router.put("/:id", traineeController.updateTrainee);
// router.delete("/:id", authMiddleware, roleMiddleware, traineeController.deleteTrainee);
router.delete("/:id", traineeController.deleteTrainee);

module.exports = router;