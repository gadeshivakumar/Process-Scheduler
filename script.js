const attri=document.getElementsByName("param")
let mode=0;


function check(){
let x=document.getElementById("pTable");
let c=document.querySelector("#Algo");

mode=c.value;

    let t=document.createElement("tr");

    t.innerHTML=`<th>Process Id</th>
                <th>Arrival time</th>
                <th>Burst time</th>
                <th>Completion Time</th>
                <th>Turn Around Time</th>
                <th>Waiting Time</th>            
    `
    x.appendChild(t);

    let nop=parseInt(prompt("Enter the number of processes :"))

    for(let i=0;i<nop;i++){
        addProcess();
    }

}


function addProcess(){
        let x=document.getElementById("pTable");
        let t=document.createElement("tr")
        
    
        for(let i=0;i<3;i++){
            let y=document.createElement("td");
            y.innerHTML=`<input type="number" class="data" >`
            t.appendChild(y)    
        }
        for(let i=3;i<6;i++){
            let y=document.createElement("td");
            y.innerHTML=`<div class="out"></div>`
            t.appendChild(y)
        }

        x.appendChild(t)
}
function delProcess(){
    let x=document.getElementById("pTable");
    x.removeChild(x.lastChild);
}




function calculate(process,arrival,burst){

    let y=document.getElementsByTagName("tr");
    let data=document.querySelectorAll(".data");
   
   
//    for(let i=0;i<(2*(y.length));i=i+2){
//         process.push(data[i].value)
//         arrival.push(data[i+1].value);
//         burst=[];
//    }



for(let i=1;i<y.length;i++){
    process.push(data[(i-1)*3].value);
    arrival.push(data[(i-1)*3+1].value);
    burst.push(data[(i-1)*3+2].value);
}

   return {pro:process,arr:arrival,bur:burst}


}

let process=[],arrival=[],burst=[];

function calculate2(){
    let result=calculate(process,arrival,burst);
    process=result.pro
    arrival=result.arr
    burst=result.bur
    
    let completion=[];
    if (mode == 1) {
        let a = [];
        for (let i = 0; i < arrival.length; i++) {
            a.push([arrival[i], i]);
        }
    
        // Sort processes by arrival time
        a.sort((a, b) => a[0] - b[0]);
    
        let total = parseInt(a[0][0]) + parseInt(burst[a[0][1]]);
        completion.push([total, a[0][1]]);
    
        for (let i = 1; i < a.length; i++) {
            if (a[i][0] <= total) {
                total += parseInt(burst[a[i][1]]);
                completion.push([total, a[i][1]]);
            } else {
                
                total = parseInt(a[i][0]) + parseInt(burst[a[i][1]]);
                completion.push([total, a[i][1]]);
            }
        }
    }
    
    else if(mode==2){
        

        let b=[]
        let mind=0
        let mini=Number.MAX_VALUE;

        for(let i=0;i<arrival.length;i++){
            if(parseInt(arrival[i])<mini){
                mini=parseInt(arrival[i])
                mind=i
            }
            else if(parseInt(arrival[i])==mini && parseInt(burst[i])<parseInt(burst[mind])){
                mini=parseInt(arrival[i])
                mind=i
            }
            b.push([parseInt(arrival[i]),parseInt(burst[i]),i,-1])
        }

     
        let total=b[mind][1]+b[mind][0]
        b[mind][3]=1
        completion.push([total,b[mind][2]])
       
        for(let i=1;i<b.length;i++){
            let avail=[]

            for(let k=0;k<b.length;k++){
                if(b[k][3]==-1 && b[k][0]<=total){
                    avail.push([b[k][1],b[k][0],b[k][2]])
                }
            }

            avail.sort((x,y)=>x[0]-y[0])

            

            if(avail.length>0){
                total+=avail[0][0]
                b[avail[0][2]][3]=1
                completion.push([total,avail[0][2]])
            
            }
            else{
                total+=1
                i-=1
            }

    }    
}


else if (mode == 3) {
    let b = [];
    let mind = 0;
    let mini = Number.MAX_VALUE;

    for (let i = 0; i < arrival.length; i++) {
        if (parseInt(arrival[i]) < mini) {
            mini = parseInt(arrival[i]);
            mind = i;
        } else if (parseInt(arrival[i]) == mini && parseInt(burst[i]) < parseInt(burst[mind])) {
            mini = parseInt(arrival[i]);
            mind = i;
        }
        b.push([parseInt(arrival[i]), parseInt(burst[i]), i, -1]); 
    }

    let count = 0;
    let total = b[mind][0] + 1;
    b[mind][1] -= 1;

    if (b[mind][1] == 0) {
        completion.push([total, b[mind][2]]);
        count += 1;
    }

    while (count != b.length) {
        let avail = [];

        for (let k = 0; k < b.length; k++) {
            if (b[k][3] == -1 && b[k][0] <= total) {
                avail.push([b[k][1], b[k][0], b[k][2]]);
            }
        }

        avail.sort((x, y) => x[0] - y[0]);

        if (avail.length > 0) {
            total += 1;
            let selectedProcess = avail[0][2];
            b[selectedProcess][1] -= 1;

            if (b[selectedProcess][1] == 0) {
                completion.push([total, selectedProcess]);
                b[selectedProcess][3] = 1; // Mark as completed
                count += 1;
            }

        } else {
            total += 1;
        }
    }
}


else if(mode==4){

    let quant=parseInt(prompt("enter value for Time Quantum"));

    let b = [];

    for (let i = 0; i < arrival.length; i++) {
        b.push([parseInt(arrival[i]), parseInt(burst[i]), i]); 
    }

    b.sort((x,y)=>x[0]-y[0])

    let count = 0;
    let total=b[0][0];

    if(b[0][1]<quant){
        total+=b[0][1]
        b[0][1]=0
    }
    else{
        total+=quant;
        b[0][1]-=quant;
    }

    if(b[0][1]==0){
        completion.push([total,b[0][2]])
        count+=1
    }

    let hash=new Map();
    
    let readq=[]

    for(let i=1;i<b.length;i++){
        if(b[i][0]<=total){
            readq.push(b[i])
            hash.set(b[i][2],b[i])
        }
    }

    
    if(b[0][1]!=0){
        readq.push(b[0])
        hash.set(b[0][2],b[0])
    }

    while (count != b.length) {
        
        let cur=readq[0]
        readq.shift();

        if(cur[1]<quant){
            total+=cur[1]
            b[cur[2]][1]=0
        }
        else{
            total+=quant;
            b[cur[2]][1]-=quant
        }

        if(b[cur[2]][1]==0){
            completion.push([total,b[cur[2]][2]])
            count+=1
        }

        else{
            for(let i=0;i<b.length;i++){
                if(!hash.has(b[i][2])){
                    readq.push(b[i])
                    hash.set(b[i][2],b[i])
                }
            }

            readq.push(cur)
        }

        
    }



}


    calculate3(completion);
    renderGanttChart(completion,arrival,burst)
}





function calculate3(completion){

    let turn=[]
    let waiting=[]
    for(let i=0;i<completion.length;i++){
        turn[i]=0
        waiting[i]=0
    }

    for(let i=0;i<turn.length;i++){
        turn[completion[i][1]]=parseInt(completion[i][0])-parseInt(arrival[completion[i][1]])
        waiting[completion[i][1]]=parseInt(turn[completion[i][1]])-parseInt(burst[completion[i][1]])
    }


    let p=document.getElementsByClassName("out");
    for(let i=0;i<arrival.length;i++){
        p[completion[i][1]*3].innerText=completion[i][0]
        p[i*3+1].innerText=turn[i]
        p[i*3+2].innerText=waiting[i]
    }
    
}





function reset() {
    document.getElementById("pTable").innerHTML = "";
    process = [];
    arrival = [];
    burst = [];
}


function renderGanttChart(completion, arrival, burst) {
            const ganttContainer = document.getElementById("gantt-container");

            let startTime = 0;
            for (let i = 0; i < completion.length; i++) {
                const processIndex = completion[i][1];
                const processCompletionTime = completion[i][0];
                const processStartTime = startTime;
                const processDuration = processCompletionTime - processStartTime;

                // Create a process block
                const processBlock = document.createElement("div");
                processBlock.className = "process";
                processBlock.style.width = `${processDuration * 50}px`; // Adjust the multiplier for better visualization

                // Set the process ID
                processBlock.innerHTML = `<span class="process-id">P${processIndex + 1}</span>`;

                // Add the process block to the Gantt container
                ganttContainer.appendChild(processBlock);

                // Update the start time for the next process
                startTime = processCompletionTime;
            }
        }