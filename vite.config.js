export default {
    root: 'src/',
    publicDir: '../public/',
    base: './',
    server: {
        host: true,
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOSTNAME' in process.env)
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    }
}