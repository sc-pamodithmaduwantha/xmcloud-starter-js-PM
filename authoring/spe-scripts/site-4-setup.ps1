Import-Function Get-ItemByIdSafe
Import-Function Update-PageTemplate
Import-Function Update-TemplateInsertOptions
Import-Function Update-LinkField

function Invoke-ModuleScriptBody {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true, Position = 0 )]
        [Item]$Site,

        [Parameter(Mandatory = $true, Position = 1 )]
        [Item[]]$TenantTemplates
    )

    begin {
        Write-Log "Cmdlet Add Home Renderings - Post Site Creation Script (Skate Park)"
        Write-Verbose "Cmdlet Invoke-ModuleScriptBody - Begin"
        Import-Function Get-ProjectTemplateBasedOnBaseTemplate
    }

    process {
        Write-Verbose "Cmdlet Invoke-ModuleScriptBody - Process"
        $sitePath = $Site.Paths.Path
        $siteCollection = $Site.Parent
        $service = [Sitecore.DependencyInjection.ServiceLocator]::ServiceProvider.GetService([Sitecore.XA.Foundation.Variants.Abstractions.Services.IAvailableRenderingVariantService])
        $item = Get-Item -Path "$sitePath/Home" -Language $Site.Language
        Write-Verbose "My site: $sitePath"

        # handle missing styles folder
        if (-not (Test-Path "$sitePath/Presentation/Styles")) {
            Import-Function Invoke-AddItem
            $action = Get-Item . -ID '{B2486523-7487-4526-978F-AD2E986B5CC4}'
            Invoke-AddItem $Site $action
        }

        Write-Verbose "Reset the start item and the rendering host"
        $siteName = $Site.Name
        $siteGrouping = Get-Item -Path "$sitePath/Settings/Site Grouping/$($sitename)" -Language $Site.Language
        $siteGrouping.StartItem = $item.ID

        Write-Verbose "Create page templates in the Site Collection"
        $basePageTemplateId = "{AC9DE9BE-8E86-4147-8FBC-739D5560408B}"
        $baseHomePageTemplateId = "{4ACCF644-A506-421F-B60F-A05E5C6196B4}"
        $baseArticlePageTemplateId = "{B0602368-F67C-433C-8700-862D480546D0}"
        $baseDetailPageTemplateId = "{A9919790-3389-4FC2-ABC8-24F73C847C8E}"
        $baseLandingPageTemplateId = "{C3C9FC9E-E7D3-44E6-B777-AA23496924C7}"
        $baseProductPageTemplateId = "{9A52202D-3A77-4F6D-B9BD-6AECED9BD49A}"
        $basePageFolderTemplateId = "{84DBE64B-0FED-4125-A971-725C0155C321}"

        $templatesRootPath = "master:/sitecore/templates/Project/$($siteCollection.Name)"

        $pageTemplate = Get-Item -Path "$templatesRootPath/Page"
        $pageTemplate."__Base template" = $basePageTemplateId

        $homePageTemplate = Update-PageTemplate -BaseTemplateId $baseHomePageTemplateId -TemplateName "Home Page" -TemplatesRootPath $templatesRootPath
        $articlePageTemplate = Update-PageTemplate -BaseTemplateId $baseArticlePageTemplateId -TemplateName "Article Page" -TemplatesRootPath $templatesRootPath
        $detailPageTemplate = Update-PageTemplate -BaseTemplateId $baseDetailPageTemplateId -TemplateName "Detail Page" -TemplatesRootPath $templatesRootPath
        $landingPageTemplate = Update-PageTemplate -BaseTemplateId $baseLandingPageTemplateId -TemplateName "Landing Page" -TemplatesRootPath $templatesRootPath
        $productPageTemplate = Update-PageTemplate -BaseTemplateId $baseProductPageTemplateId -TemplateName "Product Page" -TemplatesRootPath $templatesRootPath
        $pageFolderTemplate = Update-PageTemplate -BaseTemplateId $basePageFolderTemplateId -TemplateName "Page Folder" -TemplatesRootPath $templatesRootPath

        Write-Verbose "Update insert options"
        $insertOptions = @( $articlePageTemplate.ID, $detailPageTemplate.ID, $landingPageTemplate.ID, $productPageTemplate.ID, $pageFolderTemplate.ID )
        Update-TemplateInsertOptions -TemplateItem $homePageTemplate -InsertOptions $insertOptions
        Update-TemplateInsertOptions -TemplateItem $articlePageTemplate -InsertOptions $insertOptions
        Update-TemplateInsertOptions -TemplateItem $detailPageTemplate -InsertOptions $insertOptions
        Update-TemplateInsertOptions -TemplateItem $landingPageTemplate -InsertOptions $insertOptions
        Update-TemplateInsertOptions -TemplateItem $productPageTemplate -InsertOptions $insertOptions
        Update-TemplateInsertOptions -TemplateItem $pageFolderTemplate -InsertOptions $insertOptions

        # Add Page Design and link partial designs
        Write-Verbose "Add Page Design and link partial designs"
        $headerPartial = Get-Item -Path "$sitePath/Presentation/Partial Designs/Global/Header" -Language $Site.Language
        $footerPartial = Get-Item -Path "$sitePath/Presentation/Partial Designs/Global/Footer" -Language $Site.Language

        $defaultPageDesign = New-Item -Path "$($sitePath)/Presentation/Page Designs" -Name "Default" -ItemType "{1105B8F8-1E00-426B-BF1F-C840742D827B}"
        $defaultPageDesign.PartialDesigns = "$($headerPartial.ID)|$($footerPartial.ID)"

        $pageDesigns = Get-Item -path "$sitePath/Presentation/Page Designs" -Language $Site.Language
        $map = [Sitecore.Text.UrlString]::new()
        $map[$homePageTemplate.ID] = "$($defaultPageDesign.ID)"
        $map[$pageTemplate.ID] = "$($defaultPageDesign.ID)"
        $map[$articlePageTemplate.ID] = "$($defaultPageDesign.ID)"
        $map[$detailPageTemplate.ID] = "$($defaultPageDesign.ID)"
        $map[$landingPageTemplate.ID] = "$($defaultPageDesign.ID)"
        $map[$productPageTemplate.ID] = "$($defaultPageDesign.ID)"
        $pageDesigns.TemplatesMapping = [System.Web.HttpUtility]::UrlEncode($map.toString())

        Write-Verbose "Update the home page template"
        Set-ItemTemplate -Item $item -Template $homePageTemplate.ID
        $item = Get-Item -Path "$sitePath/Home" -Language $Site.Language

        # Update Site 4 (Skate Park) page templates
        if (Test-Path "$sitePath/Home/About") {
            Set-ItemTemplate -Path "$sitePath/Home/About" -Template $landingPageTemplate.ID
        }

        Write-Verbose "Update home page fields"
        $title = "Skate Park"
        $shortTitle = "Skate Park"
        $description = "Skate Park is a simple demo site showcasing component examples for Sitecore XM Cloud."
        $item."pageTitle" = $title
        $item."pageShortTitle" = $shortTitle
        $item."pageHeaderTitle" = $shortTitle
        $item."pageSummary" = $description
        $item."metadataTitle" = $title
        $item."metadataDescription" = $description
        $item."metadataKeywords" = "Skate Park, demo site, component examples, XM Cloud, Next.js"
        $item."ogTitle" = $title
        $item."ogDescription" = $description

        Write-Verbose "Create AI config at $sitePath/Data/AI"
        $dataFolderPath = "$sitePath/Data"
        if (-not (Test-Path $dataFolderPath)) {
            $siteFolderTemplateId = "{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}"
            New-Item -Path $sitePath -Name "Data" -ItemType $siteFolderTemplateId | Out-Null
        }
        $dataFolder = Get-Item -Path $dataFolderPath -Language $Site.Language
        $aiFolderPath = "$($dataFolder.Paths.Path)/AI"
        if (-not (Test-Path $aiFolderPath)) {
            $addAiConfigBranchTemplate = Get-Item -Path "/sitecore/templates/Branches/Project/click-click-launch/Skate Park/Add AI Config" -Language $Site.Language
            New-Item -Parent $dataFolder -Name "AI" -ItemType $addAiConfigBranchTemplate.ID | Out-Null
        }

        Write-Verbose "Create dictionary items"
        $dictionaryRoot = Get-Item -Path "$sitePath/Dictionary" -Language $Site.Language
        $dictionaryBranchTemplate = Get-Item -Path "/sitecore/templates/Branches/Project/click-click-launch/Skate Park/Add Dictionary Items" -Language $Site.Language
        New-Item -Parent $dictionaryRoot -Name "Dictionary Items" -ItemType $dictionaryBranchTemplate.ID
    }

    end {
        Write-Log "Cmdlet Invoke-ModuleScriptBody - End"
    }
}

#$site = Get-Item .
#Invoke-ModuleScriptBody -Site $site -Verbose
