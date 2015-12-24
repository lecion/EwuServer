/**
 * Created by Lecion on 12/18/15.
 */
var crypto = require('crypto')
var dcrypt = require('dcrypt')

function getRandomString(len) {
    if (!len) len = 16
    return crypto.randomBytes(Math.ceil(len / 2).toString('hex'))
}

var should = require('should')
var app = require('../../app')
var mongoose = require('mongoose')
var User = require('../../app/models/user')

var user

describe('<Unit Test', function() {
    describe('Model User:', function() {
        before(function(done){
            user = {
                name: getRandomString(),
                password: 'password'
            }
            done()
        })

        describe('Before Method save', function() {
            it('should begin without test user', function(done){
                User.find({name: user.name}, function(err, users){
                    users.should.have.length(0)

                    done()
                })
            })
        })

        describe('User save', function() {
            it('should save without problems', function(done){
                var _user = new User(user)

                _user.save(function(err) {
                    should.not.exist(err)
                    _user.remove(function (err) {
                        should.not.exist(err)
                        done()
                    })
                })
            })

            it('should password be hashed correctly', function(done){
                var password = user.password
                var _user = new User(user)

                _user.save(function(err) {
                    should.not.exist(err)
                    _user.password.should.not.have.length(0)
                    bcrypt.compare(password, _user.password, function (err, isMatch) {
                        should.not.exist(err)
                        isMatch.should.equal(true)
                        _user.remove(function (err) {
                            should.not.exist(err)
                            done()
                        })
                    })
                })
            })
        })
    })
})