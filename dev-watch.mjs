import { subscribe } from '@parcel/watcher';

(() => {
    let subscription;

    /**
     * initialize @parcel/watcher watch & init browserSync
     * We are watching the files with extensions (.js, .ts, .html, .css, .scss) but we'll ignore folders like node_modules, dist & .git
     * Note: the watcher often send duplicate events, however the use of Set of file changes & the use of a setTimeout delay gets rid of this problem.
     */
    async function init() {
        subscription = subscribe(process.cwd(), (err, events) => {
            if (err) return onError(err);
            console.log('Watcher events::', events);

            // for (const event of events) {
            //   onFileChanged(event.path);
            // }
        }, {
            ignore: [
                '**/.git/**',
                '**/dist/**',
                '**/node_modules/**',
                '!**/*.{ts,js,html,css,scss}' // which file extensions to watch
            ]
        });

        // also watch for any Signal termination to cleanly exit the watch command
        process.once('SIGINT', () => destroy());
        process.once('SIGTERM', () => destroy());
        process.stdin.on('end', () => destroy());
        process.stdin.on('exit', () => process.stdin.destroy());
    }

    /** Log to the terminal any watch errors */
    function onError(err) {
        console.error('File watcher error', err);
    }

    function onFileChanged(filepath) {
        console.log('File changed', filepath);
    }

    async function destroy() {
        console.log('Exiting the dev file watch...');
        (await subscription).unsubscribe();
    }

    // start dev watch process
    init();
})();
