const mongoose=require('mongoose');

const CommunicationhistorySchema = new mongoose.Schema({
    lead_id:{type:String,requried:true},
    date_time:{type:Date,required:true},
    type:{type:String,required:true},
    content:{type:String,requird:true}
},{timestamps:true})

const Communicationhistory=mongoose.model("communicationhistory",CommunicationhistorySchema );
module.exports=Communicationhistory;