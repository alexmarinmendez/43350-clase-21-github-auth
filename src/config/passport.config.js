import passport from "passport"
import UserModel from "../models/user.model.js"
import GitHubStrategy from 'passport-github2'

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.7ddc88ac9111a16c',
        clientSecret: '054d91ad0b162c0a3ddf0bb11f74cb3be83a5748',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        try {
            const user = await UserModel.findOne({ email: profile._json.email })
            if (user) return done(null, user)
            const newUser = await UserModel.create({
                first_name: profile._json.name,
                email: profile._json.email,
                password: " "
            })
            return done(null, newUser)
        } catch(err) {
            return done(`Error to login with GitHub => ${err.message}`)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport