const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Post saved successfully!' });
        })
        .catch((error) => {res.status(400).json({error: error});
        });
}

exports.getOneSauce = (req, res) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id })
        .then(
        () => {
            res.status(201).json({
                message: 'Sauce updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce deleted !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};


exports.likeSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            switch (req.body.like) {
                case 1:
                    sauce.likes ++;
                    sauce.usersLiked.push(req.body.userId)
                    Sauce.updateOne({_id: req.params.id}, {
                        likes: sauce.likes,
                        usersLiked: sauce.usersLiked,
                    })
                        .then(() => res.status(201).json({message: "Like saved !"}))
                        .catch(error => res.status(400).json({error}));
                    break;
                case -1:
                    sauce.dislikes++;
                    sauce.usersDisliked.push(req.body.userId);
                    Sauce.updateOne({_id: req.params.id}, {
                        dislikes: sauce.dislikes,
                        usersDisliked: sauce.usersDisliked,
                    })
                        .then(() => res.status(201).json({message: "Dislike saved !"}))
                        .catch(error => res.status(400).json({error}));
                    break;
                case 0:
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        sauce.likes--;
                        let index = sauce.usersLiked.indexOf(req.body.userId);
                        sauce.usersLiked.splice(index, 1);
                        Sauce.updateOne({_id: req.params.id}, {
                            likes: sauce.likes,
                            usersLiked: sauce.usersLiked,
                        })
                            .then(() => res.status(201).json({message: "Liked saved removed !"}))
                            .catch(error => res.status(400).json({error}));
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.dislikes--;
                        let index = sauce.usersDisliked.indexOf(req.body.userId);
                        sauce.usersDisliked.splice(index, 1);
                        Sauce.updateOne({_id: req.params.id}, {
                            dislikes: sauce.dislikes,
                            usersDisliked: sauce.usersDisliked,
                        })
                            .then(() => res.status(201).json({message: "Dislike saved removed !"}))
                            .catch(error => res.status(400).json({error}));
                    }
                    break;
                default:
                    res.status(400).json({ message: 'Didn\'t find the right case !' });
            }
        })
        .catch(error => res.status(400).json({ error }));
}
