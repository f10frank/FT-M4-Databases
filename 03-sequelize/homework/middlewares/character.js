const { Router } = require('express');
const { copyDone } = require('pg-protocol/dist/messages');
const { Op, Character, Role } = require('../db');
const router = Router();


// all request here,  start with "/character"

router.post('/', async (req, res) => {
    const {code, name, age, race, hp, mana, date_added} = req.body;

    if(!code || !name || !hp || !mana)
        return res.status(404).send("Falta enviar datos obligatorios");
    try {
            // const newCharacter = await Character.create({...req.body});
            const newCharacter = await Character.create({
                code,
                name,
                age,
                race,
                hp,
                mana,
                date_added
            });
            //console.log(newCharacter);
            return res.status(201).json(newCharacter);
    } catch (error) {
        return res.status(404).send("Error en alguno de los datos provistos");
    }
});



router.get('/',  (req, res) => {
    
    try {
    // /character?race=human
    const { race, age } = req.query;
    // const condition = race ? {where: {race}} : {};
    // const characters = await Character.findAll(condition);
    // res.json(characters);

    if(!race){
        // si no hay query debo enviar todo
        // findAll === SELECT * FROM Character;
        Character.findAll().then(result => res.json(result));
        
    } else if(!age) {
        // si hay query hay que filtrar
        Character.findAll({where: {race}}).then(result => res.json(result));
        
    } else {
        Character.findAll({where: {race, age}}).then(result => res.json(result));
    }
    
    } catch (error) {
        return res.send(error);
    }
})

router.get('/young', (req, res) => {
    Character.findAll({
        where: {
            age: {[Op.lt]: 25}
        }
    }).then(result => res.send(result)).catch(e => res.status(404).send(e));
})

router.get('/roles/:code', async (req, res) => {
    const {code} = req.params;
    try {
        let personaje = await Character.findOne({
            where:{code},
            include: Role
        })
        res.send(personaje);
    } catch (error) {
        res.status(404).send(error);
    }
})

router.get('/:code', async (req, res) => {
    const { code } = req.params;
    if(!code) return res.status(400).send(`Enviar un CODE por params`);
    try {
        const personaje = await Character.findByPk(code);
        if(!personaje) {
            return res.status(404).send(`El código ${code} no corresponde a un personaje existente`);
        }
        return res.json(personaje);
    } catch (error) {
        return res.send(error);
    }
})

router.put('/addAbilities', async (req, res) => {
    const {codeCharacter, abilities} = req.body;
    try {
        let personaje = await Character.findByPk(codeCharacter);
        let arrPromises = abilities.map(element => personaje.createAbility(element));
        await Promise.all(arrPromises);
        res.send("Abilities added");
    } catch (error) {
        res.status(404).send(error);
    }
})

router.put('/:attribute', async (req, res) => {
    const { attribute } = req.params;
    const { value } = req.query;
    try {
        await Character.update({[attribute]: value}, {
            where: {
                [attribute]: null
            }
        })
        res.send('Personajes actualizados')
    } catch (error) {
        return res.send(error);
    }
    
})

module.exports = router;

// FRONT END ENVIAMOS UN POST AL BACK CON LOS DATOS DEL BODY
// Form.jsx

// onsubmit

// BODY     axios.post("http://localhost:3000/character", state)
// QUERE    `/character?race=${human}`
// PARAMS   `/character/${human}`