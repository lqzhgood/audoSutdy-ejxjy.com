const LIST = require('./list.json').list;

const { study, getClassTime: goToStudyPage } = require('./lib.js');
const { sleep } = require('./utils.js');

(async () => {
    // 11 12 21:24
    const course = LIST[11];
    const { title, courseId, columns } = course;
    const c = columns[0];
    // const { columnId } = c;
    const { columnId, studyId, duration } = c;

    // const { studyId, duration } = await goToStudyPage(courseId, columnId);

    console.log('', columnId, courseId, studyId);

    await sleep(1000);

    const [err, res] = await study(columnId, courseId, studyId, Math.ceil(600), duration); // 21:34
    if (err) console.log('err', err);
    else console.log('res', res);
})();
