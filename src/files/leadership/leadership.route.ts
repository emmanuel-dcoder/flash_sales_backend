import express from "express"
import { isAuthenticated } from "../../utils"
import leadershipController from "./leadership.controller"

const LeadershipRoute = express.Router()

const { fetch } = leadershipController

LeadershipRoute.use(isAuthenticated)

LeadershipRoute.get("/fetch", fetch)

export default LeadershipRoute
