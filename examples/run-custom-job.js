/**
 * Run and wait for arbitrary jobs
 *
 * @param {object} options
 * @param {Environment} options.env
 * @param {Logger} options.logger
 * @param {MigrationHelpers} options.helpers
 * @return {Promise<void>}
 */
module.exports = async function ({env, logger, helpers}) {
    const jobId = "PostDeploy"

    logger.info(`Executing job ${jobId}`)
    let {id} = await helpers.executeJob(env, jobId, [{
        name: 'SiteScope',
        value: JSON.stringify({"named_sites": ["RefArch"]})
    }])

    logger.info(`Waiting for job execution ${id}`)
    await helpers.waitForJob(env, jobId, id)
}
