let AbstractOutput = require('./abstract-output');

class UserOutput extends AbstractOutput {
    /**
     * Construct
     * @param userObject: User
     */
    constructor(userObject) {
        super();

        // Init
        this.id = userObject.id;
        this.lastname = userObject.lastname;
        this.firstname = userObject.firstname;
        this.email = userObject.email;
    }
}
// export the class
module.exports = UserOutput;
