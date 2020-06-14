const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')

const Word = require('../models/Word')

// Get word
router.get('/', auth, (req, res) => {
    Word.find({user: req.user.id})
        .then(words => res.json(words))
        .catch(err => console.log(err.message))
})


// Add word
router.post('/', [auth, [
check('word', 'Word is required').not().isEmpty(),
check('nativeLan', 'NativeLan is required').not().isEmpty(),
check('foreignLan', 'ForeignLan is required').not().isEmpty(),
check('explanation', 'Explanation is required').not().isEmpty(),
check('example', 'Example is required').not().isEmpty(),
]], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.json({errors: errors.array()})
    }

    const { word, nativeLan, foreignLan, explanation, example, wasFalse } = req.body

    const newWord = new Word({
        word,
        nativeLan,
        foreignLan,
        explanation,
        example,
        wasFalse,
        user: req.user.id
    })

    newWord.save()
           .then(word => res.json(word))
           .catch(err => console.log(err.message))
})


// Delete word
router.delete('/:id', auth, (req, res) => {
    Word.findById(req.params.id)
        .then(word => {
            if(!word){
                return res.json({msg: 'Word not found!'})
            }else if(word.user.toString !== req.user.id){   
                res.json({msg: "Not authorized!"})
            }else{
                Word.findByIdAndDelete(req.params.id, (err, data) => {
                    res.json({msg: "Word Deleted"})
                })
            }
        })
        .catch(err => console.log(err.message))
})


// Update word
router.put('/:id', auth, (req, res) => {

    const { word, nativeLan, foreignLan, explanation, example } = req.body

    // Build a word object
    let wordFields = {}
    if(word) wordFields.word = word
    if(nativeLan) wordFields.nativeLan = nativeLan
    if(foreignLan) wordFields.foreignLan = foreignLan
    if(explanation) wordFields.explanation = explanation
    if(example) wordFields.example = example

    Word.findById(req.params.id)
        .then(word => {
            if(!word){
                return res.json({msg: 'Word not found!'})
            }else if(word.user.toString !== req.user.id){   
                res.json({msg: "Not authorized!"})
            }else{
                Word.findByIdAndUpdate(req.params.id, {$set: wordFields}, (err, data) => {
                    res.json({msg: "Word Updated"})
                })
            }
        })
        .catch(err => console.log(err.message))
})


module.exports = router