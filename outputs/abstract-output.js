class AbstractOutput
{
    /**
     * Construct
     */
    constructor() {}

    /**
     * Tranlate a translatable field
     * @param locale: String
     * @param field: Object
     * @return String
     */
    translate(locale, field) {
        let _translation = ' no translation';
        if (field[locale]) {
            _translation = field[locale];
        }
        else if (field[default_locale]) {
            _translation = field[default_locale];
        }
        else if (field) {
            _translation = field.toString();
        }
        return _translation;
    }

    getCleanedObject(values, object) {
        let obj = {};

        values.forEach(element => {
            obj[element] = object[element]
        });

        return obj
    }
}

module.exports = AbstractOutput;