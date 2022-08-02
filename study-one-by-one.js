const { study, getCurrClass, goToClass, getClassTime } = require('./lib.js');
const { sleep } = require('./utils.js');

const STEP = 58 * 1000;

(async () => {
    setInterval(async () => {
        await getCurrClass('公需科目', 3);
        // 10 分钟刷新一次 保持 cookies
    }, 10 * 6000);

    while (1) {
        const courseId = await getCurrClass('公需科目', 0);
        console.log('courseId', courseId);
        if (!courseId) break;
        await sleep();

        const classIdArr = await goToClass(courseId);
        await sleep();

        for (let j = 0; j < classIdArr.length; j++) {
            const columnId = classIdArr[j];
            console.log('- columnId', columnId);
            const { studyId, duration } = await getClassTime(courseId, columnId);
            console.log('- duration', duration);
            await sleep();

            let currT = 58;
            let isLast = false;

            do {
                await sleep(STEP);
                const [err, res] = await study(columnId, courseId, studyId, currT, duration);
                if (err) {
                    console.log('err', err);
                } else {
                    console.log(res, currT, duration);

                    // 最后一轮跳出
                    if (isLast) {
                        break;
                    }

                    if (currT + 60 > duration) {
                        currT = Math.ceil(duration);
                        isLast = true;
                    } else {
                        currT = currT + 60;
                    }
                }
            } while (1);
        }
    }
})();
