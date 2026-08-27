# Manual GitHub Push Order

Use a clean repository. Push one application snapshot at a time so the commit history visibly tells the evolution story.

For each folder in `01_APPLICATION_RELEASES/` in numeric order:

```bash
# from your repository root
rsync -a --delete /path/to/<version-folder>/github_snapshot/ ./
git add -A
git status
git commit -F /path/to/<version-folder>/COMMIT_MESSAGE.txt
git tag -a $(cat /path/to/<version-folder>/TAG.txt) -m "$(cat /path/to/<version-folder>/COMMIT_MESSAGE.txt)"
git push origin main
git push origin --tags
```

Before each commit, review `RELEASE_NOTES.md`. If your repository already contains public benchmark material, do **not** delete the benchmark history with `rsync --delete`; instead keep benchmark files under a stable `benchmark/` subtree and copy application source selectively.

## Recommended benchmark commits
After reaching the relevant application release, add benchmark history in chronological order from `02_BENCHMARK_EVOLUTION/`. Use separate commits/tags such as:

- `benchmark-v1` — initial CLI/full benchmark
- `benchmark-validation-v2` — end-to-end validation gate
- `benchmark-v3` — layered validation suite
- `benchmark-v3.1.1` — resilient runner/output hotfix
- `benchmark-v4.0` — calibrated suite with true pairwise metrics

Then add each immutable result set from `03_BENCHMARK_RESULTS_HISTORY/` as a separate evidence commit.
