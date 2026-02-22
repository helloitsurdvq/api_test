### Authentication
All the works is located in [api repository](https://github.com/helloitsurdvq/VDT2024-api).

HTTP Response results when using postman to call URLs when not passing authentication (without jwt):

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.7_security_notoken.jpg)

Login process and HTTP Response results when using postman to call URLs when passing authentication (with jwt):

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.1_security_login_admin.jpg)

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.8_security_withtoken.jpg)

Route authorization details can be summarized as followed:
- Admin gains full access to all CRUD operations, while Trainee is strictly limited to read-only access (GET requests) and forbidden from creating, updating, or deleting resources.
- `authMiddleware`: Must be authenticated.
- `roleMiddleware`: Requires role-based authorization.
- GET `/` (Get all trainees): Accessible to everyone without authentication.
- GET `/:id` (Get one trainee): Requires the user to be authenticated (logging in), no role-specific restrictions are applied; both trainee and admin roles can access this endpoint.
- POST `/` (Create a new trainee), PUT `/:id` (Update a trainee), DELETE `/:id` (Delete a trainee): Requires the user to be authenticated, allows `admin` to create, update, delete a new trainee and forbids `trainee` from doing these things.

```javascript
const express = require('express');
const traineeController = require("../controllers/traineeController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');
const router = express.Router();

router.use(rateLimitMiddleware);

router.get("/", traineeController.getAllTrainees);
router.get("/:id", authMiddleware, traineeController.getOneTrainee);
router.post("/", authMiddleware, roleMiddleware, traineeController.saveTrainee);
router.put("/:id", authMiddleware, roleMiddleware, traineeController.updateTrainee);
router.delete("/:id", authMiddleware, roleMiddleware, traineeController.deleteTrainee);

module.exports = router;
```
Some example:
- Everyone can view trainee list

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.2_security_getall.jpg)

- Only admin can add new trainee

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.4_security_savetrainee_fail.jpg)

- Trainee can view a trainee.

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.5_security_gettrainee_success.jpg)

- Trainee are not alllowed to delete resources

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.6_security_deletetrainee_fail.jpg)