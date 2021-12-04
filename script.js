// @ts-check

/**
 * octoherd-script-good-pr
 *
 * @param {import('@octoherd/cli').Octokit} octokit
 * @param {import('@octoherd/cli').Repository} repository
 * @param { {label?: string, text?: string} } options Custom user options passed to the CLI
 */
export async function script(octokit, repository, options) {
  const [repoOwner, repoName] = repository.full_name.split("/");
  const label = options.label || "needs info";
  const forbiddenText = options.text || "TODO";

  const issues = await octokit.paginate('GET /repos/{owner}/{repo}/issues', {
    owner: repoOwner,
    repo: repoName,
  })

  try {
    for (let i = 0; i < issues.length; i++) {
      const {body} = issues[i];

      const todoExists = body.includes(forbiddenText);

      if (todoExists) {

        await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', {
          owner: repoOwner,
          repo: repoName,
          issue_number: issues[i].number,
          labels: [label]
        })
      }
    }
  } catch(e) {
    octokit.log.error(e)
  }
}
