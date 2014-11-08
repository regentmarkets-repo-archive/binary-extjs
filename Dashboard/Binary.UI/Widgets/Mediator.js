Binary = Binary || {};

Binary.CreateMediator = function ()
{
	var result = new Ext.util.Observable();

	result.addEvents('symbolchanged');// Fires after symbol is changed
	result.addEvents('instrumentchanged');// Fires after symbol is changed
	result.addEvents('contractCompleted');// Fires after contract is done
	return result;
};