export const getOneMonthAgo = () => {
    var d = new Date();

    d.setMonth(d.getMonth() - 1);
    d.setHours(0, 0, 0, 0);

    return d.toISOString().substring(0, d.toISOString().length - 5);
};
