{
  inputs = {
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      nixpkgs,
      ags,
      ...
    }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      astalPackages = ags.inputs.astal.packages.${system};
      extraPackages =
        with astalPackages;
        [
          greet
        ]
        ++ (with pkgs; [
          matugen
          dart-sass
        ]);
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          (ags.packages.${system}.default.override {
            inherit extraPackages;
          })
          nodejs
          nodePackages.npm
          gtk4
          matugen
          dart-sass
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
          npm i --frozen-lockfile
        '';
      };

      packages.${system} =
        let
          name = "h-banii.greeter-shell";
        in
        rec {
          default = greeter;
          greeter = ags.lib.bundle {
            inherit pkgs extraPackages name;
            src = ./.;
            entry = "src/app.ts";
            gtk4 = true;
          };
          fontloader = pkgs.callPackage ./font { };
          example = pkgs.symlinkJoin {
            inherit name;

            paths = [ greeter ];

            nativeBuildInputs = with pkgs; [ makeWrapper ];

            postBuild = ''
              wrapProgram $out/bin/${name} \
                --set H_BANII_GREET_WALLPAPER /home/hbanii/wallpapers/1370937.png
            '';
          };
        };
    };
}
