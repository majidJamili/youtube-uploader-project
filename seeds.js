const mongoose = require('mongoose'); 
const Video = require('./models/videos'); 


mongoose.connect('mongodb://localhost:27017/youtubeUploader',{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log('Mongo Connection Started')
    })
    .catch(err=>{
        console.log('Oh NO Mongo Connection Error!!')
        console.log(err)
    }); 


const v = new Video({
    title:'How Was it Made? The Panton Chair',
    genre:'Production',
    youtube_video_url:'https://www.youtube.com/embed/xim1m2Bhvzc',
    description:
    'This video shows the making of a Panton Chair. The Panton stacking chair was designed in 1960 by Verner Panton. In 1967 the furniture company Vitra marketed a version in fibreglass. The more recent model shown here is made out of injection-moulded plastic.'
    })


const seedVideos = [
        {
        title:'How Cars Are Made In Factories? (Mega Factories Video)',
        genre:'Production',
        youtube_video_url:'https://www.youtube.com/embed/Zn6scKf7k_0',
        description:'A car (or automobile) is a wheeled motor vehicle used for transportation. Most definitions of cars say that they run primarily on roads, seat one to eight people, have four wheels, and mainly transport people rather than goods Large-scale, production-line manufacturing of affordable cars was started by Ransom Olds in 1901 at his Oldsmobile factory in Lansing, Michigan and based upon stationary assembly line techniques pioneered by Marc Isambard Brunel at the Portsmouth Block Mills, England, in 1802. The assembly line style of mass production and interchangeable parts had been pioneered in the U.S. by Thomas Blanchard in 1821, at the Springfield Armory in Springfield, Massachusetts. This concept was greatly expanded by Henry Ford, beginning in 1913 with the worlds first moving assembly line for cars at the Highland Park Ford Plant.'
        },
        {
        title:'Huge Car Factory - Ford',
        genre:'Production',
        youtube_video_url:'https://www.youtube.com/embed/GvWCsk-cmUU',
        description:'A car (or automobile) is a wheeled motor vehicle used for transportation. Most definitions of cars say that they run primarily on roads, seat one to eight people, have four wheels, and mainly transport people rather than goods Large-scale, production-line manufacturing of affordable cars was started by Ransom Olds in 1901 at his Oldsmobile factory in Lansing, Michigan and based upon stationary assembly line techniques pioneered by Marc Isambard Brunel at the Portsmouth Block Mills, England, in 1802. The assembly line style of mass production and interchangeable parts had been pioneered in the U.S. by Thomas Blanchard in 1821, at the Springfield Armory in Springfield, Massachusetts. This concept was greatly expanded by Henry Ford, beginning in 1913 with the worlds first moving assembly line for cars at the Highland Park Ford Plant.'
        },
        {
        title:'BMW Car Factory ROBOTS',
        genre:'Production',
        youtube_video_url:'https://www.youtube.com/embed/P7fi4hP_y80',
        description:'A car (or automobile) is a wheeled motor vehicle used for transportation. Most definitions of cars say that they run primarily on roads, seat one to eight people, have four wheels, and mainly transport people rather than goods Large-scale, production-line manufacturing of affordable cars was started by Ransom Olds in 1901 at his Oldsmobile factory in Lansing, Michigan and based upon stationary assembly line techniques pioneered by Marc Isambard Brunel at the Portsmouth Block Mills, England, in 1802. The assembly line style of mass production and interchangeable parts had been pioneered in the U.S. by Thomas Blanchard in 1821, at the Springfield Armory in Springfield, Massachusetts. This concept was greatly expanded by Henry Ford, beginning in 1913 with the worlds first moving assembly line for cars at the Highland Park Ford Plant.'
        }

]
Video.insertMany(seedVideos).
then(res =>{
    console.log(res)
})
.catch(e=>{
    console.log(error)
})



