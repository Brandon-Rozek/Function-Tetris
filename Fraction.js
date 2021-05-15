Fraction = {
    decimalToFraction: function(decimal){
        //example dec2Frac(2/9)
        //reciprocal = 9/2 = 4.5
        var reciprocal = 1/decimal;
        
        var multiplier = 1;
        while (reciprocal * multiplier % 1 != 0){
            multipler++;
        }
        return {multiplier, multiplier*reciprocal};
    }
}