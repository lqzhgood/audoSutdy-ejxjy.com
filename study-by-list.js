const fs = require('fs');
const LIST = require('./list.json');
const { study, getCurrClass, getClassTime: goToStudyPage } = require('./lib.js');
const { sleep } = require('./utils.js');

const STEP = 55 * 1000;

(async () => {
    setInterval(async () => {
        try {
            await getCurrClass('公需科目', 3);
        } catch (error) {
            // 刷新失败忽略
        }
        // 10 分钟刷新一次 保持 cookies
    }, 10 * 6000);

    for (let i = 0; i < LIST.list.length; i++) {
        const course = LIST.list[i];
        const { title, courseId, columns } = course;
        for (let j = 0; j < columns.length; j++) {
            const c = columns[j];
            const { columnId } = c; // 本地存的  studyId, duration 无效. 因为每次服务器只记录最新的 studyId
            if (c.isStudy) continue;

            // 模拟进入页面
            const { studyId, duration } = await goToStudyPage(courseId, columnId);
            await sleep(1000);

            let currT = 58;
            let isLast = false;

            console.log('columnId, courseId, studyId, currT', columnId, courseId, studyId, currT);
            do {
                await sleep(STEP);
                const [err, res] = await study(columnId, courseId, studyId, currT, duration);
                if (err) {
                    console.log('err', err);
                } else {
                    console.log(
                        new Date().toLocaleString(),
                        `${i + 1}/${LIST.list.length}`,
                        title,
                        res,
                        currT,
                        duration,
                    );

                    // 最后一轮跳出
                    if (isLast) {
                        c.isStudy = true;
                        fs.writeFileSync('./list.json', JSON.stringify(LIST, null, 4));
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
