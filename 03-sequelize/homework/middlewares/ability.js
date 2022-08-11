const { Router } = require('express');
const { Ability } = require('../db');
const router = Router();

router.post('/', async (req, res) => {
    const {name, description, mana_cost} = req.body;
    if(!name || !mana_cost) return res.status(404).send('Falta enviar datos obligatorios');
    //Ability.create({name,description,mana_cost}).then(result => res.status(201).send(result)).catch(error => res.status(404).send(error));
    try {
        const newAbility = await Ability.create({
            name,
            description,
            mana_cost
        });
        return res.status(201).json(newAbility);
    } catch (error) {
        return res.status(404).send("Error en alguno de los datos provistos");
    }
});

router.put("/setCharacter", async (req, res) => {
    const {idAbility, codeCharacter} = req.body;
    try {
        let ourAbility = await Ability.findByPk(idAbility);
        if(ourAbility) {
            await ourAbility.setCharacter(codeCharacter);
            res.send(ourAbility);
        } else {
            res.status(404).send('Ability not found')
        }
    } catch (error) {
        res.status(404).send(error);
    }
});



module.exports = router;