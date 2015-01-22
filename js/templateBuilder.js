define(['text!../templates/navbar.html', 'mustache', 'jquery', 'bootstrap'],
	function(navbar, mustache, $) {
	
		function loadCss(url) {
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = url;
			document.getElementsByTagName("head")[0].appendChild(link);
		}
		
		var examples = [
			{ name: 'Alternating', url: 'Alternating' },
			{ name: 'Bootstrap Style', url: 'BootstrapStyle' },
			{ name: 'Default', url: 'Default' },
			{ name: 'Deleting And Adding Rows', url: 'DeletingAndAddingRows' },
			{ name: 'Deleting Rows', url: 'DeletingRows' },
			{ name: 'From Table', url: 'FromTable' },
			{ name: 'From Table Using Element', url: 'FromTableUsingElement' },
			{ name: 'From Table Using Jquery', url: 'FromTableUsingJquery' },
			{ name: 'From Table With Class', url: 'FromTableWithClass' },
			{ name: 'From Table With Footer', url: 'FromTableWithFooter' },
			{ name: 'JQueryUI Style', url: 'JQueryUIStyle' },
			{ name: 'Large Data', url: 'LargeData' },
			{ name: 'Paging', url: 'Paging' },
			{ name: 'Sorting', url: 'Sorting' }
		];
		
		var path = window.location.pathname;
		var page = path.substr(path.lastIndexOf('/') + 1);
		page = page.substr(0, page.indexOf('.'));
		var navBarData = mustache.render(navbar, {
			examples: examples,
			faq: (page == 'faq'),
			thanks: (page == 'thanks'),
			serverSide: (page == 'server-side'),
			dropdown: (page && page != '/')
		});
		var results = { navbar: navBarData };
		
		$(document).ready(function() {
			//LOAD CSS
			loadCss('css/bootstrap.min.css');
			loadCss('css/site.css');
			loadCss('css/toastr.min.css');
			
			//Render Body Template
			var template = $('body').html();
			$('body').html(mustache.render(template,results));
			
			//refresh scrollspy from Bootstrap
			$('[data-spy="scroll"]').each(function () {
				var $spy = $(this).scrollspy('refresh');
			});
		});
});