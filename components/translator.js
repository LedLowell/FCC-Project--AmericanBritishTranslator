const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')
const AmericanClockRegex = /(\d{1,2}):(\d{1,2})/;
const BritishClockRegex = /(\d{1,2})\.(\d{1,2})/;

class Translator {
    libraryHandler(object, text, findByValue = false){
        //Create array of all properties in object
        let keys = Object.keys(object);
        //Check if findByValue is true
        if(!findByValue){
            //If not, text will be translated using object values
            for (let i = 0; i < keys.length; i++){
                //While a translation from object is found in text, it will be replaced with object's value
                while(text.includes(keys[i])){
                    //Create pattern to check keys[i] matches a word in text and not a part of a word
                    let pattern = `^${keys[i]}[^\\w\\d-<>]|[^\\w\\d-<>]${keys[i]}[^\\w\\d-<>]|[^\\w\\d-<>]*${keys[i]}$`;
                    //Create regEx using pattern and global tag
                    let regEx = new RegExp(pattern, "g");
                    //Test regEx in text
                    if (regEx.test(text)){
                        //Replace the value found in text with object's value
                        text = text.replace(keys[i], `<span class="highlight">${object[keys[i]]}</span>`);
                    } else {
                        //If false finish cycle
                        break;
                    }
                }
            }
            return text;
        } 
        else {
            //If it is, text will be translated using object properties
            for (let i = 0; i < keys.length; i++){
                //While a translation from object is found in text, it will be replaced with object's property
                while(text.includes(object[keys[i]])){
                    //Create pattern to check object[keys[i]] matches a word in text and not a part of a word
                    let pattern = `^${object[keys[i]]}[^\\w\\d-<>]|[^\\w\\d-<>]${object[keys[i]]}[^\\w\\d-<>]|[^\\w\\d-<>]*${object[keys[i]]}$`;
                    //Create regEx using pattern and global tag
                    let regEx = new RegExp(pattern, "g");
                    //Test regEx in text
                    if (regEx.test(text)){
                        //Replace the value found in text with object's property
                        text = text.replace(object[keys[i]], `<span class="highlight">${keys[i]}</span>`);
                    } else {
                        //If false finish cycle
                        break;
                    }
                }
            }
            return text;
        }
    }

    translateToBritish(text){
        //Convert text to lower case to be used with Libraries
        let phrase = text.toLowerCase();
        //Check each library for translations
        //Start with americanOnly because contains multi-word translations, then continue with one word translations
        phrase = this.libraryHandler(americanOnly, phrase);
        phrase = this.libraryHandler(americanToBritishSpelling, phrase);
        phrase = this.libraryHandler(americanToBritishTitles, phrase);
        //Check for time formats in phrase
        while(AmericanClockRegex.test(phrase) == true){
            //Change time format using regex groups and add span html tag
            phrase = phrase.replace(AmericanClockRegex, `<span class="highlight">$1.$2</span>`);    
        }
        //Get Words that were capitalized originally
        let capitalWords = text.match(/^[A-Z]+[a-z]*[A-Z]*[a-z]*|[A-Z]+[a-z]*[A-Z]*[a-z]*|[^\w] *[A-Z]{1} *[^\w]/g);
        //If capitalWords is truthy
        if(capitalWords){
            //Iterate through capitalWords and replace each LowerCase word to its UpperCase(original) version
            for(let i= 0; i < capitalWords.length; i++){
                phrase = phrase.replace(capitalWords[i].toLowerCase(), capitalWords[i]);
            }
        }
        //If phrase is the same as the original text
        if(phrase == text){
            //Return for no translations and original text
            return {translation: "Everything looks good to me!", text: text};
        }
        //Return translations done and original text
        return {translation: phrase, text: text};
    }

    translateToAmerican(text){
        //Convert text to lower case to be used with Libraries
        let phrase = text.toLowerCase();
        
        //Check each library for translations
        //Start with americanOnly because contains multi-word translations, then continue with one word translations
        phrase = this.libraryHandler(britishOnly, phrase);
        phrase = this.libraryHandler(americanToBritishSpelling, phrase, true);
        phrase = this.libraryHandler(americanToBritishTitles, phrase, true);
        //Check for time formats in phrase
        while(BritishClockRegex.test(phrase) == true){
            //Change time format using regex groups and add span html tag
            phrase = phrase.replace(BritishClockRegex, `<span class="highlight">$1:$2</span>`);    
        }
        //Get Words that were capitalized originally
        let capitalWords = text.match(/^[A-Z]+[a-z]*[A-Z]*[a-z]*|[A-Z]+[a-z]*[A-Z]*[a-z]*|[^\w] *[A-Z]{1} *[^\w]/g);
        //If capitalWords is truthy
        if(capitalWords){
            //Iterate through capitalWords and replace each LowerCase word to its UpperCase(original) version
            for(let i= 0; i < capitalWords.length; i++){
                phrase = phrase.replace(capitalWords[i].toLowerCase(), capitalWords[i]);
            }
        }
        //If phrase is the same as the original text
        if(phrase == text){
            //Return for no translations and original text
            return {translation: "Everything looks good to me!", text: text};
        }
        //Return translations done and original text
        return {translation: phrase, text: text};
    }
}

module.exports = Translator;