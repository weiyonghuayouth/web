dateUtil = function () {
};

// 一天的 毫秒数
dateUtil.oneDayLongTime = 86400000;

dateUtil.yyyyMMddHHmmss = "yyyy-MM-dd HH:mm:ss";

dateUtil.yyyyMMdd = "yyyy-MM-dd";

/**
 * 格式化时间
 * @param time longtime
 * @param format 如: yyyy-MM-dd HH:mm:ss
 * @returns {*|string|void|XML}
 */
dateUtil.dateFormat = function (time, format) {
    var t = new Date(time);
    var tf = function (i) {
        return (i < 10 ? '0' : '') + i;
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    });
};


/**
 * 获取之前的日期
 * @param beforeDay 前几天
 * @return Date
 */
dateUtil.getBeforeDate = function (beforeDay) {
    var date = new Date();
    date.setTime(date.getTime() - beforeDay * (dateUtil.oneDayLongTime));
    return date;
};

/**
 * 获取之前的日期 yyyy-MM-dd HH:mm:ss
 * @param beforeDay 前几天
 * @returns yyyy-MM-dd HH:mm:ss
 */
dateUtil.getBeforeDateString = function (beforeDay) {
    return dateUtil.dateFormat(dateUtil.getBeforeDate(beforeDay).getTime(), dateUtil.yyyyMMddHHmmss);
};

/**
 * 获取之前的日期 yyyy-MM-dd
 * @param beforeDay 前几天
 * @returns yyyy-MM-dd
 */
dateUtil.getBeforeDateByYYYYMMDD = function (beforeDay) {
    return dateUtil.dateFormat(dateUtil.getBeforeDate(beforeDay).getTime(), dateUtil.yyyyMMdd);
};


