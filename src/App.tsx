import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

enum ProcessStatus {
    SUCCESS = 'success', 
    ON_GOING = 'on going',
    FAILURE = 'failure',
    CANCELLED = 'cancelled',
}

interface Process {
    task_id     : string;
    start       : Date;
    completed   : Date | null;
    status      : ProcessStatus 
    will_succeed : boolean;
}

function RandomID() {
    const alpha = String.fromCharCode(Math.abs(Math.random() * 26) + 65);
    return `PID-${Date.now()}-${alpha}`
}

function MockProcess(data: Process, success: boolean , delay = 3000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data) {
                if(success) {
                    resolve({status : 200, data});
                }else{
                    resolve({status : 500, data});
                }
            } else {
                reject(new Error("provide process information"));
            }
        }, delay);
    });
}


function App() {

    const [ process, setProcess ] = useState<Process[]>([]);
    const [ pollTrigger, setPollTrigger ] = useState(0);

    useEffect(() => {
        // console.log("re-render");
    })

    useEffect(() => {
        document.title = 'Bundle Process Queue';
        const intervalId = setInterval(pollProcessStatus, 2000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if(process.length > 0) {
            for(let i = 0 ; i < process.length; i++)
            {
                const current = process[i];
                if(current.status != ProcessStatus.ON_GOING) continue;
                MockProcess(current, current.will_succeed).then((result) => {
                    const p = result as {status: number; data:Process};
                    const p_state = process.find((pp) => pp.task_id === p.data.task_id );
                    if(p_state?.status != ProcessStatus.CANCELLED) {
                        if(p.status == 200) {
                            p.data.completed = new Date();
                            p.data.status = ProcessStatus.SUCCESS;
                        }else{
                            p.data.completed = new Date();
                            p.data.status = ProcessStatus.FAILURE;
                        }
                    }
                    updateProcess(p.data);
                }).catch((err) => {
                    console.log("Call error", err);
                })
            }
        }
    }, [process])

    const pollProcessStatus = () => {
        console.log("polling...");
        setPollTrigger(prev => prev + 1);
    }

    const onStartProcess = (success: boolean) => {
        console.log("process start");
        const new_task = 
        {
            task_id : RandomID(),
            start: new Date(),
            completed: null,
            status: ProcessStatus.ON_GOING,
            will_succeed : success
        }
        setProcess([new_task,...process]);
    }

    const updateProcess = (modified_process : Process) => {
        let _process = [...process];
        for(let i = 0; i < _process.length; i++) {
            const current = _process[i];
            if(current.task_id === modified_process.task_id) {
                _process[i] = modified_process;
            }
        }
        // setProcess(_process);
    }

    const onCancelProcess = (pid : string) => {
        let _process = [...process];
        for(const p of _process) {
            if(p.task_id === pid) {
                p.status = ProcessStatus.CANCELLED;
            }
        }
        setProcess(_process);
    }

    const onClear = () => {
        console.log("clear process");
        setProcess([]);
    }
    
    return (
    <>
        <div className="flex flex-col bg-gray-100 w-screen h-screen text-gray-200 items-center justify-center">
            <div className="flex flex-row w-1/2 h-1/2">
                <div className="flex flex-col flex-grow w-1/3 bg-red p-[10px] items-center justify-center gap-4">
                    <button 
                        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded h-[50px] w-full text-center"
                        onClick={() => onStartProcess(true)}
                        >
                    Start Process (Success)
                    </button>
                    <button 
                        className="bg-red-900 hover:bg-red-800 text-white font-bold py-2 px-4 rounded h-[50px] w-full text-center"
                        onClick={() => onStartProcess(false)}
                        >
                    Start Process (Failure)
                    </button>
                    <button 
                        className="bg-gray-300 hover:bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded h-[50px] w-full text-center"
                        onClick={onClear}
                        >
                    Clear 
                    </button>
                </div>

                <div className="flex flex-col flex-grow w-2/3 p-[10px] border-l-2 border-l-gray-400 text-gray-800">

                    <div className="flex text-2xl font-bold">
                        Process Queue: 
                    </div>

                    <div className="flex-col h-full w-full overflow-y-auto">
                    {
                        process.map((p : Process) => (
                            <div className="flex flex-row h-[110px] w-full bg-gray-200 rounded-md my-5 p-5" key={`p-{${p.task_id}}`}>
                                <div className="flex-col w-full">
                                    <div className="w-full">
                                        Process ID : {`${p.task_id}`}
                                    </div>
                                    <div className="w-full">
                                        issued : {`${p.start.toISOString()}`}
                                    </div>
                                    <button 
                                        className="text-red-600 hover:bg-gray-100 p-1" 
                                        onClick={() => onCancelProcess(p.task_id)}
                                        >
                                        cancel
                                    </button>
                                </div>
                                <div className="flex w-full justify-end ">
                                    status 
                                    <div className={p.status === ProcessStatus.FAILURE || p.status === ProcessStatus.CANCELLED ? "text-red-600" : "text-blue-600"}>
                                       {` : ${p.status}`}
                                    </div>
                                    {
                                        p.status == ProcessStatus.ON_GOING &&
                                        <div className="animate-spin rounded-full h-[14px] w-[14px] ml-[10px] mt-[10px] border--2 border-b-2 border-gray-500"></div>
                                    }
                                </div>
                            </div>
                        ))
                    }
                    </div>
                </div>
            </div>
            <div className="text-lg text-gray-400 mt-[100px]">By - Michael Herman (herman.michael94@gmail.com)</div>
        </div>
    </>
    )
}

export default App
