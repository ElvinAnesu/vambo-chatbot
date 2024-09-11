import mongoose, { Schema } from "mongoose"

const sessionSchema = new Schema({
  userNumber: {
    type:String,
    required:true
  },
  flow: {
    type:String,
    default:"mainmenu"
  },
  currentStep: {
    type:String,
    default:"1"
  },
  languagePreference: {
    type:String,
    default:null
  },
  proBonoCaseType: {
    type:String,
    default:null
  },
  appointmentDetails: {
    name: {
        type: String,
        default:null
    },
    email:  {
        type: String,
        default:null
    },
    phone:  {
        type: String,
        default:null
    },
    date:  {
        type: String,
        default:null
    },
    time:  {
        type: String,
        default:null
    },
    areaOfLaw:  {
        type: String,
        default:null
    },
    notes:  {
        type: String,
        default:null
    },
  },
},{timestamps: true})

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema)

export default Session

