let socket;
const locations={
    1 : {left : '4vw',margintop : '7%',angle : '180deg'},
    2 : {left : '23vw',margintop : '7%',angle : '180deg'},
    3 : {left : '42vw',margintop : '7%',angle : '180deg'},
    4 : {left : '61vw',margintop : '7%',angle : '180deg'},
    5 : {left : '80vw',margintop : '7%',angle : '180deg'},
    6 : {left : '4vw',margintop : '39.90vw',angle : '0deg'},
    7 : {left : '23vw',margintop : '39.90vw',angle : '0deg'},
    8 : {left : '42vw',margintop : '39.90vw',angle : '0deg'},
    9 : {left : '61vw',margintop : '39.90vw',angle : '0deg'},
    10 : {left : '80vw',margintop : '39.90vw',angle : '0deg'}
}

try {
    socket = new WebSocket("ws://192.168.1.2:81");
    socket.onopen = () => {
        console.log("WebSocket connection established");
        
    };
    socket.onclose = () => {
        console.log("WebSocket connection closed");
    };
    socket.onmessage = (event) => {
        console.log(event.data);
        updateslots(event.data)
    };
    function managepark(slot,zone){
        slotst=(slot!=10)?"0":""
        slotst=slotst+slot
        park=""+zone+slotst+'r'
        console.log(park)
        socket.send(park)
        slotid="but"+zone+slot
        console.log(slotid)
        document.getElementById(slotid).style.backgroundColor="red"
        document.getElementById(slotid).disabled = true
        managecar(slot,zone)
    }
    
} 
catch(err) {
        console.log('Socket Error');
}


function updateslots(rcvddata) {
    console.log(rcvddata[0])
    for(i=0;i<20;i++){
        zone=(i<10)?'j':'c';
        slot=i+1;
        if(zone=='c') slot=slot-10;
        slotid='but'+zone+slot
        if(rcvddata[i]=='g') document.getElementById(slotid).style.backgroundColor="green";
        else{
            document.getElementById(slotid).style.backgroundColor="red";
            parkedcars(slot,zone)
        }
    }
}
function makecaranimation(loc,area){
    console.log(loc,area)
    console.log(locations[loc].left)
    let car_animation=document.createElement('style');
    let movement=document.createTextNode(`@keyframes comecar{
        0%{left: 100vw;transform: rotate(90deg);margin-top: 23.5%;}
        70%{left: ${locations[loc].left};transform: rotate(90deg);}
        80%{transform: rotate(${locations[loc].angle});margin-top: 23.5%;}
    }`);
    car_animation.appendChild(movement);
    document.getElementById(area).appendChild(car_animation)
}
 
function managecar(slot,zone){
    parkarea=(zone=='j')?'park1':'park2'
    console.log(parkarea)
    makecaranimation(slot,parkarea)
    let targetparklocation=document.getElementById(parkarea)
    console.log(targetparklocation)
    let img = document.createElement('img')
    img.src='car2.png'
    img.className='carup'
    img.id=parkarea+'car'+slot
    img.style.width='15vw'
    img.style.height='15vw'
    img.style.left=locations[slot].left
    img.style.marginTop=locations[slot].margintop
    img.style.transform= `rotate(${locations[slot].angle})`
    img.style.zIndex=1
    img.style.position='absolute'
    img.style.animation='comecar 2s'
    img.addEventListener('click',()=>{
        document.getElementById(parkarea+'car'+slot).remove()
        document.getElementById('but'+zone+slot).style.backgroundColor='green'
        slotst=(slot!=10)?"0":""
        slotst=slotst+slot
        socket.send(zone+slotst+'g')
    })
    targetparklocation.prepend(img)
}

function parkedcars(slot,zone){
    parkarea=(zone=='j')?'park1':'park2'
    console.log(parkarea)
    makecaranimation(slot,parkarea)
    let targetparklocation=document.getElementById(parkarea)
    console.log(targetparklocation)
    let img = document.createElement('img')
    img.src='car2.png'
    img.className='carup'
    img.id=parkarea+'car'+slot
    img.style.width='15vw'
    img.style.height='15vw'
    img.style.left=locations[slot].left
    img.style.marginTop=locations[slot].margintop
    img.style.transform= `rotate(${locations[slot].angle})`
    img.style.zIndex=1
    img.style.position='absolute'
    img.addEventListener('click',()=>{
        document.getElementById(parkarea+'car'+slot).remove()
        document.getElementById('but'+zone+slot).style.backgroundColor='green'
        slotst=(slot!=10)?"0":""
        slotst=slotst+slot
        socket.send(zone+slotst+'g')
    })
    targetparklocation.prepend(img)
}

