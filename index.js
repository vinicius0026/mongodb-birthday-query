'use strict';

const async = require('async');
const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/birthday', err => {
    if (err) {
        return console.log('Error connecting to mongoDB', err);
    }

    console.log('connected');

    const PersonSchema = new Schema({
        name: String,
        birthday: Date
    });

    const Person = mongoose.model('Person', PersonSchema);

    const today =  moment();
    async.series([
        cb => Person.remove({}, cb),
        cb => Person.create({
            name: 'Person1',
            birthday: moment('23-04-1990', 'DD-MM-YYYY')
        }, cb),
        cb => Person.create({
            name: 'Person2',
            birthday: moment('25-04-1990', 'DD-MM-YYYY').toDate()
        }, cb),
        cb => Person.create({
            name: 'Person3',
            birthday: new Date(1991, 3, 25)
        }, cb),
        cb => Person.create({
            name: 'Person4',
            birthday: new Date(1992, 4, 25)
        }, cb),
    ], () => Person.find({$where: `return this.birthday.getDate() === ${today.date()} && this.birthday.getMonth() === ${today.month()}`}, (err, people) => {
        console.log('found people');
        console.log('people', people);
    }));
});
