const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const projectRoot = process.cwd();

module.exports = {
    getLocaleFile: (env) => {
        return env.locale && env.locale === "en" ? `${projectRoot}/src/locale/messages.en.xlf` : null;
    },
    getOutputFolder: (env, development) => {
        if(development){
            return env.locale === "en" ? projectRoot + "/dev-nginx/app/en" : projectRoot + "/dev-nginx/app/ar";
        }
        return env.locale === "en" ? projectRoot + "/dist/app/en" : projectRoot + "/dist/app/ar";
    },
    getCleanPlugin: (env, development) => {
      let patterns;


      if (development) {
        patterns = env.locale === "en" ? ["dev-nginx/app/en"] : ["dev-nginx/app/ar"];
      } else {
        patterns = env.locale === "en" ? ["dist/app/en"] : ["dist/app/ar"];
      }


      return new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: patterns
      });
    },
    getLocaleLang: (env) => {
        return env.locale ? env.locale : "ar";
    },
    getPublicPath: (env) => {
        return env.locale === "en" ? "/app/en/" : "/app/ar/";
    }
};
