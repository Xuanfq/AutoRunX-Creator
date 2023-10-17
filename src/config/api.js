export default {
    github: 'https://github.com/Xuanfq/AutoRunX-Data',
    githubraw: 'https://raw.githubusercontent.com/Xuanfq/AutoRunX-Data/master',
    index: 'https://raw.githubusercontent.com/Xuanfq/AutoRunX-Data/master/index.json',
    defaultapi: {
        basenode: {
            nodepackage: "https://raw.githubusercontent.com/Xuanfq/AutoRunX-Data/master/basenode/${lang}/all/${nodeId}/",
            nodeconfig: "https://raw.githubusercontent.com/Xuanfq/AutoRunX-Data/master/basenode/${lang}/all/${nodeId}/config.json",
            nodedocument: "https://raw.githubusercontent.com/Xuanfq/AutoRunX-Data/master/basenode/${lang}/all/${nodeId}/README.md",
            nodeallconfigbytype: "https://raw.githubusercontent.com/Xuanfq/AutoRunX-Data/master/basenode/${lang}/misc/allconfigbytype.json"
        },
        marketnode: {
            nodepackage: "https://raw.githubusercontent.com/Xuanfq/AutoRunX-Data/master/marketnode/${lang}/all/${nodeId}/",
            nodeconfig: "https://raw.githubusercontent.com/Xuanfq/AutoRunX-Data/master/marketnode/${lang}/all/${nodeId}/config.json",
            nodedocument: "https://raw.githubusercontent.com/Xuanfq/AutoRunX-Data/master/marketnode/${lang}/all/${nodeId}/README.md"
        }
    }
}