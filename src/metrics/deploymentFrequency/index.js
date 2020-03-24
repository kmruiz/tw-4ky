const directory = require('./directory')
const emitter = require('./emitter')
const filter = require('./filter')

module.exports = (db, sink) => {
    const _directory = directory(db)
    const _emitter = emitter(sink)
    const _filter = filter(db)

    return async deployment => {
        const shouldBeProcessed = await _filter(deployment)
        if (!shouldBeProcessed) {
            return
        }

        _directory(deployment)
        _emitter(deployment)
    }
}