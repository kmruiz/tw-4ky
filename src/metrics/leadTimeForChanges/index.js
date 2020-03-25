const directory = require('./directory')
const emitter = require('./emitter')
const filter = require('./filter')

const applyMetric = (db, sink) => {
    const _directory = directory(db)
    const _emitter = emitter(sink)
    const _filter = filter(db)

    return async changeSet => {
        const shouldBeProcessed = await _filter(changeSet)
        if (shouldBeProcessed.changes.length === 0) {
            return
        }

        _directory(shouldBeProcessed)
        _emitter(shouldBeProcessed)
    }
}

const CronJob = require('cron').CronJob

module.exports = (source, db, sink) => {
    const leadTimeForChanges = applyMetric(db, sink)

    const job = new CronJob('*/2 * * * *', async () => {
        const changeSets = await source.changeSets()
        changeSets.forEach(leadTimeForChanges)
    }, null, true);

    job.start()
    return job
}