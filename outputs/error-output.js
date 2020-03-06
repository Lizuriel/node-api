
class ErrorOutput {
    /**
     * Construct
     * @param errorObject: error
     */
    constructor(errorObject) {

        // Init
        this.message = errorObject.message ? errorObject.message : '';
        this.name = errorObject.name ? errorObject.name : '';
        this.field = errorObject.field ? errorObject.field : '';
        this.value = errorObject.value ? errorObject.value : '';
    }
}
// export the class
module.exports = ErrorOutput;
