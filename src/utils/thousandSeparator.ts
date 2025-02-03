const thousandSeparator = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default thousandSeparator;