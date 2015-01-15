Binary = Binary || {};

Binary.Mediator = new Ext.util.Observable(
{
	events:
	{
		'marketsAvailable': true,
		'symbolChanged': true,
		'contractCompleted': true
	}
});
