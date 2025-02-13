{
  inputs = {
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      ags,
      ...
    }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      astalPackages = ags.inputs.astal.packages.${system};
      extraPackages =
        [
          astalPackages.greet
          pkgs.matugen
          pkgs.dart-sass
          self.packages.${system}.fontloader
        ]
        ++ (with pkgs.gst_all_1; [
          gstreamer
          gst-plugins-base
          gst-plugins-good
          gst-plugins-bad
          gst-plugins-ugly
          gst-libav
          gst-vaapi
        ]);
      icon = pkgs.fetchurl {
        url = "https://raw.githubusercontent.com/NixOS/nixos-artwork/refs/heads/master/logo/nix-snowflake-white.svg";
        hash = "sha256-J/t94Bz0fUCL92m1JY9gznu0DLfy6uIQO6AJGK3CEAY=";
      };
      config = pkgs.writeText "h-banii.greeter-config" ''
        {
          "wallpaper": null,
          "font_family": "M PLUS 2",
          "icon": "${icon}",
          "vendor_name": "NixOS",
          "debug": true
        }
      '';
      overrideAgs =
        agsPkg:
        agsPkg.overrideAttrs (prev: {
          # https://github.com/NixOS/nixpkgs/issues/321983
          # https://github.com/NixOS/nixpkgs/issues/221017
          postInstall = lib.concatStrings [
            (prev.postInstall or "")
            ''
              export GDK_PIXBUF_MODULE_FILE="${
                pkgs.gnome._gdkPixbufCacheBuilder_DO_NOT_USE {
                  extraLoaders = [
                    pkgs.librsvg
                    pkgs.webp-pixbuf-loader
                  ];
                }
              }"
            ''
          ];
        });
      inherit (nixpkgs) lib;
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          (overrideAgs (
            ags.packages.${system}.default.override {
              inherit extraPackages;
            }
          ))
          nodejs
          nodePackages.npm
          gtk4
          matugen
          dart-sass
          self.packages.${system}.fontloader
        ];
        shellHook = ''
          export AGS_DIR=''$PWD
          run() {
            ags run "''${AGS_DIR}/src/app.ts" --gtk4 --define SRC="'""''${AGS_DIR}'" "$@"
          }
          format() {
            npx prettier ''${AGS_DIR}/src --write
          }
          tmp=`mktemp`
          jq '.dependencies.astal |= "${astalPackages.gjs}/share/astal/gjs"' < package.json > $tmp
          mv $tmp package.json
          export H_BANII_GREET_CONFIG=${config}
          npm i --frozen-lockfile
        '';
      };

      packages.${system} =
        let
          name = "h-banii.greeter";
        in
        rec {
          default = greeter;
          greeter = overrideAgs (
            ags.lib.bundle {
              inherit pkgs extraPackages name;
              src = ./.;
              entry = "src/app.ts";
              gtk4 = true;
            }
          );
          fontloader = pkgs.callPackage ./font { };
          example = pkgs.symlinkJoin {
            inherit name;

            paths = [ greeter ];

            nativeBuildInputs = with pkgs; [ makeWrapper ];

            postBuild = ''
              wrapProgram $out/bin/${name} \
                --set H_BANII_GREET_CONFIG ${config}
            '';
          };
        };
    };
}
