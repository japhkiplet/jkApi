
import { createUser, deleteUser, getAllUsers, getUser, login, loginRequired, register, updateUser } from '../contollers/UserController.js';


const routes = (app) => {
    //people routes
    app.route('/users')
        .get( loginRequired,getAllUsers)
        .post( loginRequired,createUser);

    app.route('/users/:username')
        .put( updateUser)
        .get( getUser)
        .delete(deleteUser);

        // auth routes
    app.route('/auth/register')
    .post(register);

    app.route('/auth/login')
    .post(login);


  


};
export default routes;