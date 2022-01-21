const express = require("express");
const router = express.Router();

//on a besoin de notre contrôler pour associé les fonctions au différentes routes
const userCtrl = require("../controllers/user");

//on ajoute notre middleware pour la vérification du MDP
const verifyPassword = require("../middleware/verifyPassword");

// middleware de vérification pour l'email et le mdp
const { registerValidation } = require("../middleware/inputValidation");
//on crée deux routes
//ce sont des routes post car le front va également envoyé des informations

//middleware d'authentification que nous appliquerons à nos routes pour les protégés
const auth = require("../middleware/auth");


//=================================>
/////////////////// SIGNUP
//=================================>

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *       - Create a user account.
 *     description: Signup a user.
 *     produces:
 *       - application/json
 *     parameters:
 *       - username: User
 *         name: Email
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       email:
 *                         type: string
 *                         description: The user email.
 *                         example: test@test.com
 *                         required:
 *                         - email 
 *       - password: password
 *         name: Password of user
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       password:
 *                         type: 
 *                         description: The user's password.
 *                         example: aStrongPassword77$
 *                         required:
 *                          - password     
 *     responses:
 *       201:
 *         description: User created!
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         description: The user email.
 *                         example: test@test.com
 *                       password:
 *                         type: string
 *                         description: The user's password.
 *                         example: aStrongPassword77$
 *                         required:
 *                          - email
 *                          - password     
 */

router.post("/signup", verifyPassword, registerValidation, userCtrl.signup);

//=================================>
/////////////////// LOGIN
//=================================>

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Logged in a user.
 *     description: Logged in a user.
 *     produces:
 *       - application/json
 *     parameters:
 *       - username: User
 *         name: Email
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       email:
 *                         type: string
 *                         description: The user email.
 *                         example: test@test.com
 *                         required:
 *                         - email 
 *       - password: password
 *         name: Password of user
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       password:
 *                         type: 
 *                         description: The user's password.
 *                         example: aStrongPassword77$
 *                         required:
 *                          - password     
 *     responses:
 *       '200':
 *         description: User connected!
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         description: The user id.
 *                         example: 6125535f4066323cd5788255
 *                       token:
 *                         type: string
 *                         description: Return the session's infos.
 *                         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbW9AZGVtby5mciIsIl9pZCI6IjYxMjU1MzVmNDA2NjMyM2NkNTc4ODI1NSIsInVzZXJJZCI6IjYxMjU1MzVmNDA2NjMyM2NkNTc4ODI1NSIsImlhdCI6MTYyOTgzNjEyOSwiZXhwIjoxNjI5OTIyNTI5fQ.MYaY1OxXDX6p_qa25YNgZWP7VtoL3NZm4wxdW4c0rYI
 *                         required:
 *                          - email
 *                          - password   
 */

router.post("/login", verifyPassword, registerValidation, userCtrl.login);

//=================================>
/////////////////// READ DATAS
//=================================>

/**
 * @swagger
 * /auth/readDatas:
 *   get:
*     tags:
*       - Read user data.
 *     description: Read user data.
 *     produces:
 *       - application/json
 *     parameters:
 *       - username: User
 *         name: Email
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       email:
 *                         type: string
 *                         description: The user email.
 *                         example: test@test.com
 *                         required:
 *                         - email 
 *       - password: password
 *         name: Password of user
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       password:
 *                         type: 
 *                         description: The user's password.
 *                         example: aStrongPassword77$
 *                         required:
 *                          - password   
 *     responses:
 *       200:
 *         description: Retrieve user account information.
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         description: The user id.
 *                         example: 6125535f4066323cd5788255
 *                       email:
 *                         type: string
 *                         description: The user email.
 *                         example: test@test.com
 *                       password:
 *                         type: string
 *                         description: The user's password.
 *                         example: aStrongPassword77$
 *                         required:
 *                          - email
 *                          - password     
 */
router.get(
  "/read-datas",
  auth,
  verifyPassword,
  registerValidation,
  userCtrl.readDatas
);

//=================================>
/////////////////// EXPORT DATAS
//=================================>

/**
 * @swagger
 * /auth/export-datas:
 *   get:
*     tags:
*       - Export user data.
 *     description: Export user data to a file.
 *     produces:
 *       - application/json
 *     parameters:
 *       - username: User
 *         name: Email
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       email:
 *                         type: string
 *                         description: The user email.
 *                         example: test@test.com
 *                         required:
 *                         - email 
 *       - password: password
 *         name: Password of user
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       password:
 *                         type: 
 *                         description: The user's password.
 *                         example: aStrongPassword77$
 *                         required:
 *                          - password   
 *     responses:
 *       200:
 *         description: Export user data to a file.
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: Successfully wrote file
 */

router.get(
  "/export-datas",
  auth,
  verifyPassword,
  registerValidation,
  userCtrl.exportDatas
);

//=================================>
/////////////////// DELETE
//=================================>

/**
 * @swagger
 * /auth/delete:
 *   delete:
*     tags:
*       - Delete user account.
 *     description: Delete user account.
 *     produces:
 *       - application/json
 *     parameters:
 *       - username: User
 *         name: Email
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       email:
 *                         type: string
 *                         description: The user email.
 *                         example: test@test.com
 *                         required:
 *                         - email 
 *       - password: password
 *         name: Password of user
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       password:
 *                         type: 
 *                         description: The user's password.
 *                         example: aStrongPassword77$
 *                         required:
 *                          - password   
 *     responses:
 *       200:
 *         description: Export user data to a file.
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: User deleted successfully!  
 */

router.delete(
  "/delete",
  auth,
  verifyPassword,
  registerValidation,
  userCtrl.delete
);

//=================================>
/////////////////// UPDATE
//=================================>

/**
 * @swagger
 * /auth/update:
 *   put:
 *     tags:
 *       - Updated a user account.
 *     description: Update email or password user's account.
 *     produces:
 *       - application/json
 *     parameters:
 *       - username: User
 *         name: Email
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       email:
 *                         type: string
 *                         description: The user email.
 *                         example: test@test.com
 *       - password: password
 *         name: Password of user
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       password:
 *                         type: 
 *                         description: The user's password.
 *                         example: aStrongPassword77$    
 *     responses:
 *       '201':
 *         description: User updated!
 *         requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         description: Return the same userId.
 *                         example: 6125535f4066323cd5788255
 *                       email: 
 *                          type: string
 *                          description: Encrypte the new e-mail.
 *                          example: +p5nbewbzo5br7dtqreovw==
 *                       password: 
 *                          type: string
 *                          description: Encrypte the new password.
 *                          example: $2b$10$3VgSp.tEPijEpwDWiH4K3e7eTWGhi2J38lSLjLvKclLRXsBjVnqN.
 *                       token:
 *                         type: string
 *                         description: Return the new session's infos.
 *                         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbW9AZGVtby5mciIsIl9pZCI6IjYxMjU1MzVmNDA2NjMyM2NkNTc4ODI1NSIsInVzZXJJZCI6IjYxMjU1MzVmNDA2NjMyM2NkNTc4ODI1NSIsImlhdCI6MTYyOTgzNjEyOSwiZXhwIjoxNjI5OTIyNTI5fQ.MYaY1OxXDX6p_qa25YNgZWP7VtoL3NZm4wxdW4c0rYI 
 */

router.put(
  "/update",
  auth,
  verifyPassword,
  registerValidation,
  userCtrl.update
);

//=================================>
/////////////////// REPORT
//=================================>

/**
 * @swagger
 * /auth/report:
 *   post:
 *     tags:
 *       - Reported a user account.
 *     description: Report a user account.
 *     produces:
 *       - application/json
 *     parameters:
 *       - username: User
 *         name: Email
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       email:
 *                         type: string
 *                         description: The user email.
 *                         example: test@test.com
 *                         required:
 *                         - email 
 *       - password: password
 *         name: Password of user
 *         in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: string
 *                     properties:
 *                       password:
 *                         type: 
 *                         description: The user's password.
 *                         example: aStrongPassword77$
 *                         required:
 *                          - password     
 *     responses:
 *       '200':
 *         description: A report has been created, we will deal with it as soon as possible.
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Adds the active user to the report user and adds a report.
 *                         example: A report has been created, we will deal with it as soon as possible.
 */

router.post(
  "/report",
  auth,
  verifyPassword,
  registerValidation,
  userCtrl.report
);

//on exporte le router de ce fichier
module.exports = router;
