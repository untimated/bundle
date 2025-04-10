## How to Run this project

1. go to root directory of this project
2. ```npm install``` or ```yarn``` 
2. ```npm run dev``` or ```yarn dev```

![Screenshot 2025-04-10 224146](https://github.com/user-attachments/assets/214731bd-0dd4-4117-80a3-13d5d825f713)

additional question :

- What did you choose to mock the API and why? 
I use setTimeout, it lacks real use case scenario but it's good enough and fast. 
I thought of using some other that you mention but i don't have the confidence as i never used those libs before.

- If you used an AI tool, what parts did it help with?
I use AI for things like documentation + example refresher, sometimes i forgot how to write it
and to spot logic bugs faster (usually AI not that good at debugging logical error).

- What tradeoffs or shortcuts did you take?
I cut all file splittings, and focus on single file (app) to reduce systemic bug like file linking.
then i also utilizes tailwind for faster ui prototyping instead standard css (flexible but not enough time).
I also think i missed some of the optimizations effort, plenty of bugs (like cancel after process finished) and testing because of time panick :D

- What would you improve or add with more time?
Improve the message queue in form of react hooks or module, or something that close to temporal / bullmq mechanism
then i would like to add animation for each process card. Probably not using button but proper upload UI like drop file etc.

- What was the trickiest part and how did you debug it?
the queues, process management, status and the hardest part is to make polling look good.
but the worst problem is that i was stucked at the beginning with silly error (my index.css overrides tailwind)
and i didn't realize it until like 30 minutes. Time wasted greatly



Thankyou,
Michael Herman

