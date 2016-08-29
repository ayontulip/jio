$(document).ready(function(){
/*
Developer : Vikas sharma
Developer's ID : vikas@thecatalystindia.in
Company : The Catalyst
Company Website: www.thecatalystindia.in
*/
/****************************************************************************/
sidebarFix();
/****************************/
});( jQuery );/* document.ready Closed */
/****************************************/
$(window).resize(function()
{
	sidebarFix();
});
/****************************************/
function sidebarFix()
{
	var winWidth = $(window).innerWidth();
	var winHeight = $(window).innerHeight();
	if(winWidth > 767)
	{
		$('.sidebar').height(winHeight - 102);
	}
	else
	{
		$('.sidebar').height("auto");
	}
}
/*********************************************************************************************************************************/


